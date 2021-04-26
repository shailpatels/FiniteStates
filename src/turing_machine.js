import {API} from '../node_modules/@shailpatels/fss/src/api.js';
import {canvasManager} from '../node_modules/@shailpatels/fss/src/canvasManager.js';

export const Levels = [
	{
		'tm' : true,
		'label' : 'TM',
		'regex' : 'hi',
		'num_strings' : 1,
		'default' : '_',
		'accept' : (s,i) => {
			let usr = ''
			for(let x of s){
				if(x === '_')
					continue;

				usr += x;
			}
			return usr === ':)';
		}
	},
	{
		"tm" : true,
		"label" : 'all-zero',
		"regex" : '1+',
		"num_strings" : 5,
		"max_size" : 2,
		"default" : '_',
		"accept" : (s,i) => { 
			for(let x of s){ 
				if(x === '1')
					return false;
			} 
			return true;
		},
		"desc" : `
		<p>Given a string made of some number of 1s, write a 0 over each 1</p>`,
		"return" : false
	},
	{
		//2
		"tm" : true,
		"label" : "UAdder",
		"regex" : "1+01+",
		"num_strings" : 5,
		"max_size" : 5,
		"default" : "_",
		"accept" : (s,i) => {
			let parts = i.split('0');
			let comp = parts[0] + parts[1];
			let usr = '';
			for(let x of s){
				if(x === '0'){
					break;
				}
				if(x === '1'){
					usr += x;
				}
			}
			return usr === comp;
		},
		"desc" : `<p>Given two numbers represented in unary, add them together. The 2 numbers will be seperated by a '0'.
		E.g: 2+3 is represented as: 110111 and the sum should be 11111</p>`,
		"return" : false
	},
	{
		//3
		"tm" : true,
		"label" : "UAdder",
		"regex" : "1+01+",
		"num_strings" : 5,
		"max_size" : 5,
		"default" : "_",
		"accept" : (s,i) => {
			let parts = i.split('0');
			let comp = parts[0] + parts[1];
			let usr = '';
			for(let x of s){
				if(x === '0'){
					break;
				}
				if(x === '1'){
					usr += x;
				}
			}
			return usr === comp;
		},
		"desc" : `<p>Given two numbers represented in unary, add them together. The 2 numbers will be seperated by a '0'.
		E.g: 2+3 is represented as: 110111 and the sum should be 11111. Once the solution is written to the tape, 
		return the head back to the starting cell position (the leftmost 1 in this case).</p>`,
		"return" : true
	},
	{
		//4
		"label" : "mod3",
		"diff" : 2,
		"tm" : true,
		"regex" : "1+0*1*",
		"accepts" : ['0', '1', '10', '11', '100', '101'],
		"num_strings" : 5,
		"max_size" : 3,
		"default" : "_",
		"accept" : (s,i) => {
			
			let comp_10 = parseInt(i,2);
			let usr = s.length > 0 ? parseInt(s[0],10) : 0;

			return usr === (comp_10 % 3);
		},
		"return" : false,
		"desc" : `<p>Given a string represented in binary (base 2) calculate the remainder if the input is divided by 3.
		<i>Note</i> your result should be in base decimal (base 10). E.g: 11 is base2 for 3, 3/3 leaves a 
		remainder of 0. Leave your result in either the starting cell 
		or the cell directly to left of it. <i>hint</i> Try looking for a pattern with different numbers,
		1 divided by 3 has a remainder of 1, 2 divided 3 has 2 left over and 3 divided by 3 has a remainder of 0</p>`
	},
	{
		//5
		"label" : "mod3",
		"diff" : 3,
		"tm" : true,
		"regex" : "1+0*1*",
		"accepts" : ['0', '1', '10', '11', '100', '101'],
		"num_strings" : 5,
		"max_size" : 3,
		"default" : "_",
		"accept" : (s,i) => {
			let comp_10 = parseInt(i,2);
			let usr = s.length > 0 ? parseInt(s[0],10) : 0;

			return usr === (comp_10 % 3);
		},
		"return" : false,
		"desc" : `<p>Given a string represented in binary (base 2) calculate the remainder if the input is divided by 3.
		<i>Note</i> your result should be in base decimal (base 10). E.g: 11 is base2 for 3, 3/3 leaves a 
		remainder of 0. Leave your result in either the starting cell 
		or the cell directly to left of it.</p>`
	},
	{
		//6
		"label" : "a<sup>n</sup>b<sup>n</sup>",
		"diff" : 1,
		"tm" : true,
		'regex' : 'a{n}b{n}',
		'variables' : ['n','m'],
		'reject-regex' : 'a{n}b{m}',
		'accepts' : [ 'ab', '', 'aaabbb', 'aabb'],
		'num_strings' : 4,
		'max_size' : 4,
		'default' : '_',
		'desc' : `<p>Given a string of a's and b's accept if the number of a's and b's are equal, otherwise reject.
		Feel free to use the tape however you need, accepting and rejecting is the only criteria for this level.</p>`,
		'accept' : () => {
			return true;
		}
	},{
		"label" : "uSub",
		"diff" : 1,
		'tm' : true,
		"regex" : "1+01+",
		"num_strings" : 4,
		"max_size" : 4,
		"desc" : `<p>Given two numbers represented in unary, (seperated by a '0') subtract the second
		from the first, if the second number is greater than or equal to the first, replace the first number with Blank
		symbols ('_')</p>`,
		"default" : "_",
		"accepts" : ['101', '1101'],
		"accept" : (s,i) => {
			let parts = i.split('0')
			let usr = 0;
			for(let x of s){
				if(x === '0')
					break;

				if(x === '1')
					usr ++;
			}

			if(parts[1].length >= parts[0].length){
				return usr === 0;
			}else {
				return usr === (parts[0].length - parts[1].length);
			}
		}
	}
];


export class TuringMachine{
	constructor(tgt_index, size_ = 13){

		this.max = 0;
		this.min = 0;

		this.mem = {
			//index -> symbol
		}

		this.default_sym = ""

		this.size = size_;
        this.half_size = (size_ - 1)/2;
        this.index = this.half_size;
        this.tgt_index = 0;

        this.test_strings = [];
        this.current_string_index = 0;

        this.offset = 0;
        this.is_return = false;
	}

	moveLeft(){
		this.index --;
		this.offset --;

		if ( this.index < this.min ){
            this.min --;
        }

        this.renderTape();
	}

	moveRight(){
		this.index ++;
		this.offset ++;
   

        if ( this.index > this.max ){
            this.max ++;
        }

        this.renderTape();
	}

	moveLeftRight(dir='left'){
		if(dir==='left'){
			this.moveLeft();
		}else if(dir === 'right'){
			this.moveRight();
		}
	}

	write(sym){
		this.mem[this.index] =  sym;
		this.renderCell(this.index);
	}

	read(){
        return this.readAt( this.index ); 
    }

    readAt( index ){
        let tmp = this.mem[index]
        if (!tmp){
            return this.default_sym;
        }

        return tmp;
    }

    reset(){
    	this.index = this.half_size;
    	this.min = 0;
    	this.max = 0;
    	this.mem = {};
    	this.offset = 0;
    	this.current_string_index = 0;
    	this.setInitial(this.test_strings[this.current_string_index]);
    }

    setInitial(string){
    	for(let i = 0; i < string.length; i++){
    		this.mem[i+this.index] = string[i];
    	}
    	this.renderTape();
    }

    moveNextRow(){
    	let str_index_cpy = this.current_string_index + 1;
    	this.reset();
    	if((str_index_cpy) < this.test_strings.length){
    		this.current_string_index = str_index_cpy;
    		this.setInitial(this.test_strings[this.current_string_index]);
    	}
    }

    renderTape(){
		let tgt = document.getElementById(`tape-${this.tgt_index}`);
		if(!tgt){
			return;
		}


		for(let i = 0; i < this.size;i++){
			document.getElementById(`cell-${this.tgt_index}-${i}`).innerHTML = this.readAt(i+this.offset);
		}
	}

	//update a single cell instead of the entire tape
	renderCell(index){
		let tgt = document.getElementById(`cell-${this.tgt_index}-${index}`);
		if(!tgt){
			return;
		}

		tgt.innerHTML = this.readAt(index);
	}

	getTapeContents(){
		let ret = '';
		for (let x in this.mem){
			ret += this.mem[x];
		}
		return ret;
	}

	checkStart(isReturn){
		return this.index === this.half_size;
	}
}


export function addTape(tgt_index, t){
	let tgt = document.getElementById(`tape-${tgt_index}`);
	if(!tgt){
		document.getElementById('tape-container').innerHTML += `
			<table class="tape" id="tape-${tgt_index}" ></table>
		`;
		tgt = document.getElementById(`tape-${tgt_index}`);
	}

	let new_tape = `<tr>`;
	for(let i = 0 ; i < t.size; i++){
		new_tape += `<td id="cell-${tgt_index}-${i}"
			${ (i === t.index ? `class="current_cell"` : '') }
		>${t.default_sym}</td>`
	}
	tgt.innerHTML += (new_tape + `</tr>`);
}


function scrollToBot(){
	let objDiv = document.getElementById("desc");
	objDiv.scrollTop = objDiv.scrollHeight;
}


export function loadTMIntro(){
	let desc = document.getElementById('desc');
	let CM = canvasManager.getInstance();

	desc.innerHTML = `<p>Welcome to the final model of computation, the Turing Machine (TM)! Like 
	the pushdown automata, the TM has external memory, called the tape. However, you can access any index can
	write and read the current cell, (highlighted in the center). Unlike previous automata, you are 
	not reading input from the right hand side, and instead are reading directly from the tape - so its up to you
	to make sure your machine finishes!
	Lets start off by going over how to move the Turing machine, create 2 states and a transition between them </p>`;

	function firstArrow(){
		if(CM.arrows.length !== 1 && CM.nodes.length !== 2)
			return;

		desc.innerHTML += `<p>Now click on the transition and notice the two direction options. The Turing Machine at each step
		will test if the first textbox is equal to the current cell and if so will write whatever is in the second
		textbox if its not empty. Blank cells are denoted by an underscore and can be matched with the '_' symbol.
		After reading and writing the TM will move the head either left or right.
		In that transition match the symbol 'h' and write a colon ':' and move right. Then create a third state and transition to it by matching match 
		the 'i' and write a closing paren ')'</p>`;
		scrollToBot();
	}

	function secArrow(){
		if(CM.arrows.length !== 2)
			return;

		desc.innerHTML += `<p>Then finally create an accept state and create a transition to it. Then 
		step through machine and watch as the 'hi' is turned into ':)'. This TM will accept if the string ':)'
		is present on the tape and nothing else, remember that you are reading and writing to the tape, not the 
		table on the right. Press clear to restart this level. Notice the special syntax on the transitions,
		the general format is <i> [match this symbol] : [write this symbol] → [Left/Right]</i></p>`;
		scrollToBot();
	}

	API.addFunc("add_new_arrow", firstArrow);
	API.addFunc("add_new_arrow", secArrow);

	function unload(){
		API.removeFunc("add_new_arrow", firstArrow);
		API.removeFunc("add_new_arrow", secArrow);
	}

	return unload;
}


