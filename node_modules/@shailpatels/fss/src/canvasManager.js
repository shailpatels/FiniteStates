import {inputManager} from './input.js';
import {Node, Arrow} from './elements.js';
import {findAngle} from './lib/geometry.js';
import {simManager} from './simulate.js';
import {Graph,save} from './lib/graph.js';
import {API} from './api.js';

var canvasManager = (function(){
    var instance;
    return {
        init : function (canvas) {
            instance = new __CANVAS_MANAGER(canvas);
            return instance;
        },

        clear(){
            instance = null;
        },

        getInstance: function(){
            if (!instance) {
                throw 'Canvas manager not initialized';
            }
            return instance;
        }
    };
})();


class __CANVAS_MANAGER{
    constructor(canvas_){
        this.canvas = canvas_;
        this.context = this.canvas.getContext("2d");  
        this.height = 500;
        this.width = 1000;

        this.selected_arrow = null;
        this.current_arrow = null;
        this.start_node = null;

        this.arrows = [];
        this.nodes = [];

        this.is_arrow_menu_drawn = false;
        this.is_over_node = false;
        this.is_over_arrow = false;
        this.is_starting_arrow = false;
        this.auto_save = true;

        this.node_radius = 25;
        this.graph = new Graph();

        //map object ids 
        this.map = {};
    }


    /**
    * create a new node if given nothing, otherwise 
    * the given node will be placed and added to the graph
    *
    * @param {Node|void} node_
    */
    addNewNode(node_ = null){
        let IM = inputManager.getInstance();
        let SM = simManager.getInstance();

        if(node_ === null){
            node_ = new Node(IM.mouse_pos, this.nodes.length.toString(10), this.nodes.length);
        }
        
        this.nodes.push( node_ );
        this.graph.addVertex( node_ );

        if(!SM.is_starting){
            SM.resetSim();
        }

        if(this.auto_save){
            save();
        }

        API.call("add_new_node", node_);
    }


    /**
    * create a new arrow and connect it between two nodes
    *
    * @param {Node} start_node 
    * @param {Node} end_node
    */
    addNewArrow(start_node, end_node){
        let SM = simManager.getInstance();
        let IM = inputManager.getInstance();
        
        let is_self = false;
        let angle = 0.0;
        if(start_node === end_node){
            is_self = true;
            angle = findAngle(start_node.pos, IM.mouse_pos);
        }

        let new_arrow = new Arrow(start_node, end_node, is_self, angle);
        
        start_node.connected_arrows.push(new_arrow);
        
        if(!is_self){
            end_node.connected_arrows.push(new_arrow);
        }

        this.arrows.push(new_arrow);
        this.graph.addEdge(start_node, end_node);

        if(!SM.is_starting){
            SM.resetSim();
        }

        if(this.auto_save){
            save();
        }

        API.call("add_new_arrow", new_arrow);
    }

    /**
    * Delete a node and all connections to it
    * 
    * @param {Node|Number} tgt - node to delete
    */
    deleteNode(tgt){
        let SM = simManager.getInstance();

        if(typeof tgt === "number"){
            tgt = this.nodes[tgt];
        }

        for(let arr of tgt.connected_arrows){
            this.arrows.splice( this.arrows.indexOf(arr), 1);
        }

        //update labels
        for(let i = tgt.index; i < this.nodes.length ; i ++){
            this.nodes[i].label = i-1;
            this.nodes[i].index = parseInt(this.nodes[i],10);
        }

        //remove from list
        const index = this.nodes.indexOf(tgt);
        this.nodes.splice(index, 1);
        this.graph.deleteVertex(tgt);

        if(!SM.is_starting){
            SM.resetSim();
        }

        if(this.auto_save){
            save();
        }

        API.call("delete_node", tgt);
    }

    deleteArrow(arr_){
        let SM = simManager.getInstance();

        let start = arr_.start_node;
        let end = arr_.end_node;

        const s_index  = start.connected_arrows.indexOf(arr_);
        start.connected_arrows.splice(s_index, 1);
        if(start !== end){
            const e_index  = end.connected_arrows.indexOf(arr_);
            end.connected_arrows.splice(e_index,1);
        }

        const index = this.arrows.indexOf(arr_);
        this.arrows.splice(index,1);
        this.graph.deleteEdge(start, end);

        if(!SM.is_starting){
            SM.resetSim();
        }

        if(this.auto_save){
            save();
        }

        API.call("delete_arrow", arr_);
    }


    updateMap(new_obj){
        this.map[new_obj.id] = new_obj.serialize();
    }

    getObjFromID(id){
        for(let n of this.nodes){
            if (n.id === id){
                return n;
            }
        }

        for(let a of this.arrows){
            if(a.id === id){
                return a
            }
        }

        return null;
    }

    getGraph(){
        return this.graph.graph;
    }

    clearCanvas(){
        this.graph = new Graph();
        this.nodes = [];
        this.arrows = [];
    }
}

export{
    canvasManager
}
