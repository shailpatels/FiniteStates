
/** 
* point represents 2D position
* @typedef {Object} Point
*/ 
class Point{
    /**
    * @param {Number} X_
    * @param {Number} Y_
    */
    constructor(X_ = 0,Y_ = 0){
        this.X = X_;
        this.Y = Y_;
    }

    /**
    * @param {Number} X_
    * @param {Number} Y_
    */
    set(X_,Y_){
        this.X = X_;
        this.Y = Y_;
        return this;
    }

    product(m){
        return new Point( this.X * m, this.Y * m );
    }
}


/**
finds euclidean distance between two points
* 
* @param {Point} a
* @param {Point} b
* @returns {Number}
*/
function getDistance(a, b){
    let x_ = Math.abs(a.X - b.X);
    let y_ = Math.abs(a.Y - b.Y);
    return Math.hypot(x_, y_); 
}


/**
* finds angle between two points in radians
*
* @param {Point} start_pos
* @param {Point} end_pos
* @returns {Number}
*/
function findAngle(start_pos, end_pos) {
    // make sx and sy at the zero point
    let r = Math.atan2((end_pos.Y-start_pos.Y), (end_pos.X - start_pos.X));

    if(r < 0){
        r = Math.abs(r);
    }else{
        r = (2 * Math.PI) - r;
    }

    return r;
}

/**
* find the midpoint between two points
* 
* @param {Point} a
* @param {Point} b
* @returns {Point}
*/
function getMidPoint(a, b){
    let X = Math.abs(a.X + b.X)/2;
    let Y = Math.abs(a.Y + b.Y)/2;
    return new Point(X, Y);
}


//https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
function matrixDot (A, B) {
    /* eslint-disable no-unused-vars */
    var result = new Array(A.length).fill(0).map(
        row => new Array(B[0].length).fill(0)
    );
    /* eslint-enable no-unused-vars */

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
        })
    });
}

export{
    Point,
    getDistance,
    findAngle,
    getMidPoint
}
