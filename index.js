var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    ctx = canvas.getContext("2d")
}

canvas.height = Math.floor(document.documentElement.clientHeight)
    canvas.width = Math.floor(document.documentElement.clientWidth)

/*
canvas.height = Math.floor(window.innerHeight * 3 / 4)
canvas.width = Math.floor(window.innerWidth * 3 / 4)
*/

//###########################################################################################################
// GLOBALS GLOBALS GLOBALS GLOBALS
//###########################################################################################################

//#####################################
// COLORS AND STYLINGS
//#####################################
const BLACK = "rgb(0,0,0)"
const SILVER = "rgb(192,192,192)"
const SIENNA = "rgb(160,82,45)"
const BLUE = "rgb(0,0,255)"
const HOT_PINK = "rgb(255,105,180)"
const LIGHT_GREY = "rgb(220,220,220)"
const RED = "rgb(255,0,0)"
const ORANGE = "rgb(255,140,0)"
const SANDY_YELLOW = "rgb(253,223,119)"
const SANDY_BROWN = "rgb(244,164,96)"
const IVORY = "#fffff0"
const LIMESTONE = "rgb(246,248,220)"
const GRANITE = "#4A5355"
const BRONZE = "#88540b"
const GREEN = "rgb(0,255,0)"
const PURPLE = "rgb(148,0,211)"
const DIRT_BROWN = "#573B0C"
const DUNGEON_BRONZE = "#594f46"
const LIGHT_GREEN = "rgb(152,251,152)"
const DEEP_SKY_BLUE = "rgb(0,191,255)"
const ROYAL_PURPLE = "#7851a9 "
const ORANGE_YELLOW = "#ffae42"
const IMPERIAL_RED = "#ED2939"
const MAHOGANY = "#5B443E"

const END_DARK_ALPHA = 0.5


const VOID_COLOR = BLACK
const PORTAL_COLOR = SILVER
const PORTAL_FADE_COLOR = BLACK

const TEXT_BACKGROUND_COLOR = IVORY// "rgb(222,184,135)"
const TEXT_BORDER_COLOR = LIGHT_GREY
const TEXT_FONT = "20px Arial"
const TEXT_COLOR = "rgb(0,0,0)"

const GREEK_FLOOR_COLOR = IVORY
const GREEK_WALL_COLOR = SILVER
const GREEK_COL_COLOR = SILVER


const CORNER_OBJ_COLOR = SIENNA
const VESTIBULE_COLOR = BRONZE
const ROMAN_WALL_COLOR = VESTIBULE_COLOR
const ROMAN_FLOOR_COLOR = GRANITE

const CROSS_COLOR = ORANGE
const FRANCE_FLOOR_COLOR = GRANITE
const FRANCE_WALL_COLOR = BRONZE
const FRANCE_OFF_COLOR = SIENNA

const EGYPT_FLOOR_COLOR = SANDY_YELLOW
const EGYPT_WALL_COLOR = SANDY_BROWN
const EGYPT_COL_COLOR = SANDY_BROWN
const PHAROH_COLOR = BRONZE

const END_FLOOR_COLOR = LIGHT_GREY
const END_WALL_COLOR = BRONZE


const OVERWORLD_WALL_COLOR = DUNGEON_BRONZE
const OVERWORLD_FLOOR_COLOR = DIRT_BROWN
const TORCH_SILVER = SILVER
const TORCH_BROWN = SIENNA
const GREEK_DOOR_COLOR = DEEP_SKY_BLUE
const ROMAN_DOOR_COLOR = ROYAL_PURPLE
const FRANCE_DOOR_COLOR = IMPERIAL_RED
const EGYPT_DOOR_COLOR = ORANGE_YELLOW
const FINAL_DOOR_COLOR = MAHOGANY
const FINAL_DOOR_STROKE = SILVER
const OPEN_DOOR_COLOR = IVORY




const TEST_STRING = "hello, my name is joe, I want to tell you all about what I have been up to lately. I have to make way more filler text than I expected which is why none of this means anything unless you subscribe to iceberg theory where even if I'm not trying to inject any meaning, tunconscious event in my mind influence my writing in a such a way as to make my opinion about my work irrelevant"
const TO_STRING = "You can't tell what's different, but the world is not the same as it just was...."

const GREEK_VICTORY_TEXT = "You feel a slight breeze. Somewhere far away, a bird sings. Your work here is done."
const ROMAN_VICTORY_TEXT = "A loud hiss echos through the chamber. Order has been restored, and your work here is done."
const FRANCE_VICTORY_TEXT = "Aha! As the last one cicks into place, the unholy mirage begins to fade. Your work here is done."
const EGYPT_VICTORY_TEXT = "An old clay tablet, with something written on it... \"Who are you who can walk through walls? Surely no mere door could stop you. \""
//const SAGE_TEXT = "Oh, well hello young champion. You have a keen eye for detail. There is nothing left for you here. I was told to give you this code, though I must admit I don't know what it's for. https://tinyurl.com/y8funcmj"




//####################################
// CONST VALUES
//###################################
const PORTAL_POINTS_CONST = 50
const PORTAL_POINTS_RADIUS = 1

const CELL_SIZE = 40
const HALF_CELL = Math.floor(CELL_SIZE / 2)
const SHIFT_TIME = 300 // in millis
const SCREEN = {
    width: 600,
    height: 600
}
const CENTER_ROW = Math.floor(Math.floor(SCREEN.height / CELL_SIZE) / 2)
const CENTER_COL= Math.floor(Math.floor(SCREEN.width / CELL_SIZE) / 2)

const ORIGIN = {
    x: Math.floor((canvas.width - SCREEN.width) / 2),
    y: Math.floor((canvas.height - SCREEN.height) / 2)
}

const MAIN_SPAWN = 0
const GREECE_SPAWN = 1
const ROME_SPAWN = 2
const FRANCE_SPAWN = 3
const EGYPT_SPAWN = 4
const END_SPAWN = 5


console.log(`can wh=${canvas.width},${canvas.height}, origing=${ORIGIN.x},${ORIGIN.y}`)

//#####################################
// ENUMS
//#####################################
const SOLVED = 0;
const UNSOLVED = 1;
const PRIMARY = 73 // "i"
const SECONDARY = 71// "g"
const INSPECT = "inspect"
const GRAB = "grab"
const LEFT = "left"
const RIGHT = "right"
const UP = "up"
const DOWN = "down"
const TEXT_FINISHED = -1
//######################################
// GLOBAL DATASTRUCTURES
//######################################

const mapData = new Map()
mapData.set("greece", {
    path: "map_jsons/greece.json",
    template: null
})
mapData.set("overworld", {
    path: "map_jsons/overworld.json",
    template: null
})
mapData.set("rome", {
    path: "map_jsons/rome.json",
    template: null
})
mapData.set("france", {
    path: "map_jsons/france.json",
    template: null
})
mapData.set("egypt", {
    path: "map_jsons/egypt.json",
    template: null
})
mapData.set("end", {
    path: "map_jsons/end.json",
    template: null
})


const questProgress = {
    greece: UNSOLVED,
    france: UNSOLVED,
    egypt: UNSOLVED,
    rome: UNSOLVED
}

function totalVictory() {
    return (questProgress.greece == SOLVED &&
	    questProgress.rome == SOLVED &&
	    questProgress.france == SOLVED &&
	    questProgress.egypt == SOLVED)
}

const dirMap = new Map()
dirMap.set(LEFT, [-1, 0])
dirMap.set(UP, [0, -1])
dirMap.set(RIGHT, [1, 0])
dirMap.set(DOWN, [0, 1])


var keyData =  {
    keyStack: new Array(),
    isKeyNew:  new Map(),
    logic: null,
    isBlocking: false
}

keyData.isKeyNew.set(LEFT, true)
keyData.isKeyNew.set(UP, true)
keyData.isKeyNew.set(RIGHT, true)
keyData.isKeyNew.set(DOWN, true)
keyData.isKeyNew.set(INSPECT, true)
keyData.isKeyNew.set(GRAB, true)

function registerEventListeners() {
    document.addEventListener("keydown", onKeyPress , false)
    document.addEventListener("keyup", onKeyUp , false)
}

function onKeyPress(event) {
    if (event.keyCode == '37' && keyData.isKeyNew.get(LEFT)) {
	keyData.keyStack.push(LEFT)
	keyData.isKeyNew.set(LEFT, false)
	keyData.logic(LEFT)
    }
    else if (event.keyCode == '38' && keyData.isKeyNew.get(UP)) {
	keyData.keyStack.push(UP)
	keyData.isKeyNew.set(UP, false)
	keyData.logic(UP)
    }
    else if (event.keyCode == '39' && keyData.isKeyNew.get(RIGHT)) {
	keyData.keyStack.push(RIGHT)
	keyData.isKeyNew.set(RIGHT, false)
	keyData.logic(RIGHT)
    }
    else if (event.keyCode == '40' && keyData.isKeyNew.get(DOWN)) {
	keyData.keyStack.push(DOWN)
	keyData.isKeyNew.set(DOWN, false)
	keyData.logic(DOWN)
    }
    else if (event.keyCode == PRIMARY && keyData.isKeyNew.get(INSPECT)) {
	keyData.isKeyNew.set(INSPECT, false)
	keyData.logic(INSPECT)
    }
    else if (event.keyCode == SECONDARY && keyData.isKeyNew.get(GRAB)) {
	keyData.isKeyNew.set(GRAB, false)
	keyData.logic(GRAB)
    }
}

function onKeyUp(event) {
    if (event.keyCode == '37') {
	keyData.keyStack.splice(keyData.keyStack.indexOf(LEFT), 1)
	keyData.isKeyNew.set(LEFT, true)
	if (keyData.keyStack.length !== 0) keyData.logic(keyData.keyStack[keyData.keyStack.length - 1])
    }
    else if (event.keyCode == '38') {
	keyData.keyStack.splice(keyData.keyStack.indexOf(UP), 1)
	keyData.isKeyNew.set(UP, true)
	if (keyData.keyStack.length !== 0) keyData.logic(keyData.keyStack[keyData.keyStack.length - 1])
    }
    else if (event.keyCode == '39') {
	keyData.keyStack.splice(keyData.keyStack.indexOf(RIGHT), 1)
	keyData.isKeyNew.set(RIGHT, true)
	if (keyData.keyStack.length !== 0) keyData.logic(keyData.keyStack[keyData.keyStack.length - 1])
    }
    else if (event.keyCode == '40') {
	keyData.keyStack.splice(keyData.keyStack.indexOf(DOWN), 1)
	keyData.isKeyNew.set(DOWN, true)
	if (keyData.keyStack.length !== 0) keyData.logic(keyData.keyStack[keyData.keyStack.length - 1])
    }
    else if (event.keyCode == PRIMARY) {
	keyData.isKeyNew.set(INSPECT, true)
    }
    else if (event.keyCode == SECONDARY) {
	keyData.isKeyNew.set(GRAB, true)
	keyData.logic(GRAB)
    }
}

function blockLogic(logic) {
    console.log("blocking logic")
}


//###########################################################################################################
// 
//###########################################################################################################




/////////////////////////////////////////////////////
var drawable = {
    draw: function(mapOrigin, row, col, delta, dir, alpha) {
//	console.log(`draw: orig=${mapOrigin} rox,col = [${row},${col}] delta=${delta}`)
	let relRow = row - mapOrigin[0]
	let relCol = col - mapOrigin[1]
	if (isInView(relRow, relCol, dir)) {
	    let coord = gridToGlobal(relRow, relCol, delta, dir)
	   // console.log(`coord = ${coord} relr,c=[${relRow},${relCol}]`)
	    this.drawImg(coord[0], coord[1], alpha)
	   // drawGridRect(coord[0], coord[1], relRow, relCol, "rgb(0,255,255)")//default
	}
    },
    inc: function(dir) {
	this.row += dir[1]
	this.col += dir[0]
    },
    singleCellContains: function(row, col) {
	return this.row == row && this.col == col
    },
    getSingleCellFrontier: function(dir) {
	return [[incRow(this.row, dir), incCol(this.col, dir)]]
    }
}

var bigDrawable = {
    draw: function(mapOrigin, row, col, delta, dir, alpha) {
	let relRow = row - mapOrigin[0]
	let relCol = col - mapOrigin[1]
	let cells = this.getCells(relRow, relCol)
	let d = false
	cells.forEach(function(cell) {
	    if (isInView(cell[0], cell[1], dir)) d = true
	})
	if (d) {
	    let coord = gridToGlobal(relRow, relCol, delta, dir)
	    this.drawImg(coord[0], coord[1], alpha)
	   // drawGridRect(coord[0], coord[1], relRow, relCol, "rgb(0,255,255)")//default
	}
    }
}


var player = Object.create(drawable, {
    row: {value: 0,
	  writable: true},
    col: {value: 0,
	  writable: true},
    dir: {value: [0,1]},
    drawImg: {value:  function(x, y, alpha) {
//	console.log("drawing Player x,y = " + x + ", " + y)
	drawGridRect(x, y, "rgb(255,0,0)")

    }},
    isMoving: {value: true,
	       writable: true},
    contains: {value: function(row, col) {
	return this.row === row && this.col === col
    }},
    getAdjCells: {value: function() {
	var l = []
	for (const dir of dirMap.values()) {
	    //console.log(dir)
	    let coord = []
	    coord.push(incRow(this.row, dir))
	    coord.push(incCol(this.col, dir))
	    l.push(coord)
	    
	}
	return l
    }}
})


var overLay = {
    registerCallback: function(callback) {
	this.callback = callback
    },
    registerLogic: function(logic) {
	this.prevLogic = logic
	keyData.logic = this.eventLogic
    },
    callback: null,
    prevLogic: null,
}


function textOverlay(text) {
    var overlay = Object.create(overLay, {
	text: {value: text},
	textpnt: {value: 0,
		    writable: true
		   }
    })
    overlay.hasTrigger = false
    overlay.eventLogic = function(worldEvent) {
	if (worldEvent === INSPECT) {
	    console.log(overlay)
	    overlay.step()
	}

	if (worldEvent === GRAB) {
	    overlay.prevLogic(GRAB)
	}
    }
    overlay.curText = text
    overlay.step = function() {
	if (overlay.textpnt !== TEXT_FINISHED) {
	    let pnt = wrappedTextbox(overlay.curText)
	    if (pnt === TEXT_FINISHED) overlay.textpnt = TEXT_FINISHED
	    else {
		overlay.textpnt += pnt
		overlay.curText = overlay.text.slice(overlay.textpnt, overlay.text.length)
	    }
	}
	else {
	    if (overlay.hasTrigger) {
		overlay.activateTrigger()
	    }
	    keyData.logic = overlay.prevLogic
	    overlay.callback()
	    overlay.textpnt = 0
	    overlay.curText = overlay.text
	}	
    }
    return overlay    
}

function textOverlayVictoryTrigger(text, trigger) {
    let overlay = textOverlay(text)
    overlay.hasTrigger = true
    overlay.activateTrigger = trigger
    return overlay
}


function deltaDir(delta, dir) {
    let index = Math.floor(Math.abs(dir[0] + dir[1]) / 2)
    let x = delta[1 - index] * dir[0]
    let y = delta[index] * dir[1]
    return [x, y]
}

function gridDeltaDir(delta, dir) {
    let index = Math.floor(Math.abs(dir[0] + dir[1]) / 2)
    let r = delta[1 - index] * dir[1]
    let c = delta[index] * dir[0]
    return [r,c]
}

function dumbMoveDir(delta, dir) {
    let index = Math.floor(Math.abs(dir[0] + dir[1]) / 2)
    let x = delta[1 - index] * dir[1]
    let y = delta[index] * dir[0]
    return [x, y]
}



function dist(p0,p1) {
    let sum = 0
    for (i = 0; i < p0.length; i ++) {
	sum += Math.pow(Math.abs(p0[i] - p1[i]), 2)
    }
    return Math.sqrt(sum)
}

//https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
// ^thanks dude
function intersection(x0, y0, r0, x1, y1, r1) {
        var a, dx, dy, d, h, rx, ry;
        var x2, y2;

        /* dx and dy are the vertical and horizontal distances between
         * the circle centers.
         */
        dx = x1 - x0;
        dy = y1 - y0;

        /* Determine the straight-line distance between the centers. */
        d = Math.sqrt((dy*dy) + (dx*dx));

        /* Check for solvability. */
        if (d > (r0 + r1)) {
            /* no solution. circles do not intersect. */
            return false;
        }
        if (d < Math.abs(r0 - r1)) {
            /* no solution. one circle is contained in the other */
            return false;
        }

        /* 'point 2' is the point where the line through the circle
         * intersection points crosses the line between the circle
         * centers.  
         */

        /* Determine the distance from point 0 to point 2. */
        a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

        /* Determine the coordinates of point 2. */
        x2 = x0 + (dx * a/d);
        y2 = y0 + (dy * a/d);

        /* Determine the distance from point 2 to either of the
         * intersection points.
         */
        h = Math.sqrt((r0*r0) - (a*a));

        /* Now determine the offsets of the intersection points from
         * point 2.
         */
        rx = -dy * (h/d);
        ry = dx * (h/d);

        /* Determine the absolute intersection points. */
        var xi = x2 + rx;
        var xi_prime = x2 - rx;
        var yi = y2 + ry;
        var yi_prime = y2 - ry;

        return [xi, xi_prime, yi, yi_prime];
    }

var turtle = {
    x: 0,
    y: 0,
    beginPath: function() {
	ctx.beginPath()
    },
    moveTo: function(delta) {
	this.x += delta[0]
	this.y += delta[1]
	ctx.moveTo(this.x, this.y)
	
    },
    lineTo: function(delta) {
	this.x += delta[0]
	this.y += delta[1]
	ctx.lineTo(this.x, this.y)
    },
    arcTo: function(delta, radius, innerArc) {
	let xp = this.x + delta[0]
	let yp = this.y + delta[1]
	let centers = intersection(this.x, this.y, radius, xp, yp, radius)
	
	let cx = (innerArc) ? centers[0] : centers[1]  //guessed at these, let's see if they actually work
	let cy = (innerArc) ? centers[2] : centers[3]
	let startAngle = Math.atan2(this.y - cy, this.x - cx)
	let endAngle  = Math.atan2(yp - cy, xp - cx)
	ctx.arc(cx, cy, radius, startAngle, endAngle, !innerArc)
	this.x = xp
	this.y = yp
    },
    closePath: function() {
	ctx.closePath()
    },
    stroke: function(color) {
	let orig = ctx.strokeStyle
	ctx.strokeStyle = color
	ctx.stroke()
	ctx.strokeStyle = orig
    },
    fill: function(color) {
	let orig = ctx.fillStyle
	ctx.fillStyle = color
	ctx.fill()
	ctx.fillStyle = orig
    }
}




//#######################################################################3
// CELLS AND MAP FEATURES MAKING THEM WORLDS AREALITY
//########################################################################

    

var cellPrototype = Object.create(drawable, {
    drawImg: {value: function(x, y, alpha) {
	drawGridRect(x, y, "rgb(0,255,255)")//default
	
    }},
    isObstacle: {value: false}
})

function emptyCell(overlay) {
    let cell = Object.create(cellPrototype)
    cell.overlay = overlay
    return cell
}

function worldEdgeCell() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGridRect(x, y, BLACK)
    }
    cell.isObstacle = true
    return cell
}

function portalCell(dir) {
    let cell = Object.create(drawable)
    let points = []
    for (i = 0; i < 50; i ++) {
	let dx = Math.floor(Math.random() * CELL_SIZE)
	let dy = Math.floor(Math.random() * CELL_SIZE)
	points.push([dx,dy])
    }
    cell.drawImg = function(x, y, alpha) {
	drawGradientRect(x, y, PORTAL_COLOR, PORTAL_FADE_COLOR, dir)
	//drawRect(x, y, BLUE)
/*	points.forEach(function(pnt) {
	    drawCircle(x + pnt[0], y + pnt[1], 1, PORTAL_SPOT_COLOR)
	})*/
    }
    cell.isObstacle = false
    return cell
}

function lowerPortal() {
    return portalCell(1)
}

function upperPortal() {
    return portalCell(-1)
}

function greekCol(size) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, GREEK_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, size, GREEK_COL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function bigCol() {
    return greekCol(HALF_CELL)
}

function medCol() {
    return greekCol(Math.floor(HALF_CELL * 3/4))
}

function smallCol() {
    return greekCol(Math.floor(HALF_CELL / 2))
}

function greekWallCell() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, GREEK_WALL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function greekFloorCell() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, GREEK_FLOOR_COLOR)
    }
    cell.isObstacle = false
    return cell
}

/////////////////////////

function normalDoor(color) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, 3 * CELL_SIZE, 3 * CELL_SIZE, OVERWORLD_WALL_COLOR)
	drawCircle(x + CELL_SIZE + HALF_CELL, y + CELL_SIZE + HALF_CELL, CELL_SIZE + HALF_CELL, color)
	drawGenRect(x, y + CELL_SIZE + HALF_CELL, 3 * CELL_SIZE, 2 * CELL_SIZE, color)
    }
    cell.isObstacle = false
    cell.isLink = true
    return cell
}

function greekDoor() {
    return normalDoor(GREEK_DOOR_COLOR)
}

function romeDoor() {
    return normalDoor(ROMAN_DOOR_COLOR)
}

function franceDoor() {
    return normalDoor(FRANCE_DOOR_COLOR)
}

function egyptDoor() {
    return normalDoor(EGYPT_DOOR_COLOR)
}

function finalDoor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, CELL_SIZE * 4, CELL_SIZE * 6, OVERWORLD_WALL_COLOR)
	drawCircle(x + 2 * CELL_SIZE, y + CELL_SIZE * 2, 2 * CELL_SIZE, FINAL_DOOR_COLOR)
	drawGenRect(x, y + 2 * CELL_SIZE, 4 * CELL_SIZE, 4 * CELL_SIZE, FINAL_DOOR_COLOR)
	drawTorch(x, y + 2 * CELL_SIZE,
		  (questProgress.greece == SOLVED) ? GREEK_DOOR_COLOR: FINAL_DOOR_COLOR,
		  (questProgress.greece == SOLVED) ? ORANGE: FINAL_DOOR_COLOR)
	drawTorch(x, y + 4 * CELL_SIZE,
		  (questProgress.rome == SOLVED) ? ROMAN_DOOR_COLOR: FINAL_DOOR_COLOR,
		  (questProgress.rome == SOLVED) ? ORANGE : FINAL_DOOR_COLOR)
	drawTorch(x + 2 * CELL_SIZE, y + 2 * CELL_SIZE,
		  (questProgress.france == SOLVED) ? FRANCE_DOOR_COLOR: FINAL_DOOR_COLOR,
		 (questProgress.france == SOLVED) ? ORANGE: FINAL_DOOR_COLOR)
	drawTorch(x + 2 * CELL_SIZE, y + 4 * CELL_SIZE,
		  (questProgress.egypt == SOLVED) ? EGYPT_DOOR_COLOR: FINAL_DOOR_COLOR,
		  (questProgress.egypt == SOLVED) ? ORANGE: FINAL_DOOR_COLOR)
	if(totalVictory()) {
	    drawCircle(x + 2 * CELL_SIZE, y + CELL_SIZE * 2, 2 * CELL_SIZE, OPEN_DOOR_COLOR)
	    drawGenRect(x, y + 2 * CELL_SIZE, 4 * CELL_SIZE, 4 * CELL_SIZE, OPEN_DOOR_COLOR)
	}
	
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function secretDoor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, CELL_SIZE * 2, CELL_SIZE * 2, OVERWORLD_WALL_COLOR)
	drawCircle(x + CELL_SIZE, y + CELL_SIZE, CELL_SIZE, FINAL_DOOR_COLOR)
	drawGenRect(x, y + CELL_SIZE, 2 * CELL_SIZE, CELL_SIZE, FINAL_DOOR_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function overworldTopWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, OVERWORLD_WALL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function overworldLeftWall() {
    return overworldTopWall()
}

function overworldRightWall() {
    return overworldTopWall()
}

function overworldBotWall() {
    return overworldTopWall()
}

function blankObstacle() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {}
    cell.isObstacle = true
    return cell
}

function blankNonObstacle() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {}
    cell.isObstacle = false
    return cell
}



function torch() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, 2 * CELL_SIZE, 2 * CELL_SIZE, OVERWORLD_WALL_COLOR)
	drawTorch(x, y, RED, ORANGE)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}


function overworldFloor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, OVERWORLD_FLOOR_COLOR)
    }
    cell.isObstacle = false
    return cell
}

//////////////////////////////////////////

function linkedCell(link, transform, isObstacle, color) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	if (!link.hasBeenDrawn) {
	    let coord = transform(x, y)
	    drawRect(x, y, color)
	    link.drawImg(coord[0], coord[1], alpha)
	}
    }
    cell.isObstacle = isObstacle
    return cell
}

function romeAlcove(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	x = (dir[0] == 1) ? x : x + CELL_SIZE
	y = (dir[1] == 1) ? y : y + CELL_SIZE
	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.moveTo(deltaDir([-8 * CELL_SIZE, 10 * CELL_SIZE], dir))

	turtle.arcTo(deltaDir([17 * CELL_SIZE, 0], dir), 8 * CELL_SIZE + HALF_CELL, true)
	
	turtle.lineTo(deltaDir([-2 * CELL_SIZE, 0], dir))
	turtle.lineTo(deltaDir([0, -2 * CELL_SIZE], dir))
	turtle.lineTo(deltaDir([-2 * CELL_SIZE, 0], dir))

	turtle.arcTo(deltaDir([-9 * CELL_SIZE, 0], dir), Math.floor(9 / 2 * CELL_SIZE), false)

	turtle.lineTo(deltaDir([-2 * CELL_SIZE, 0], dir))
	turtle.lineTo(deltaDir([0, 2 * CELL_SIZE], dir))
	turtle.lineTo(deltaDir([-2 * CELL_SIZE, 0], dir))

	turtle.closePath()
	turtle.fill(VESTIBULE_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeAlcoveTop() {
    return romeAlcove([1,1])
}

function romeAlcoveRight() {
    return romeAlcove([-1,1])
}

function romeAlcoveLeft() {
    return romeAlcove([1, -1])
}



function romeWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, ROMAN_WALL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function romeFloor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, ROMAN_FLOOR_COLOR)
    }
    cell.isObstacle = false
    return cell
}

function romeCorner(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, HOT_PINK)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeCornerTL() {
    return romeCorner([1,1])
}

function romeCornerTR() {
    return romeCorner([-1,1])
}

function romeCornerBL() {
    return romeCorner([1,-1])
}

function romeCornerBR() {
    return romeCorner([-1,-1])
}

//////////
function romeMiddleRect(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, HOT_PINK)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeMiddleRectLeft() {
    return romeMiddleRect(-1)
}

function romeMiddleRectRight() {
    return romeMiddleRect(1)
}

///////////

function romeSquare() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, HOT_PINK)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeVest(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeVestLeft() {
    return romeVest(-1)
}

function romeVestRight() {
    return romeVest(1)
}

function romeWeirdVest() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.lineTo([2 * CELL_SIZE, 0])
	turtle.arcTo([4 * CELL_SIZE, 3 * CELL_SIZE], 3 * CELL_SIZE, false)
	turtle.lineTo([0, CELL_SIZE])
	turtle.lineTo([-6 * CELL_SIZE, 0])
	turtle.lineTo([0, -4 * CELL_SIZE])
	turtle.closePath()
	turtle.fill(ROMAN_WALL_COLOR)

	turtle.beginPath()
	turtle.moveTo([11 * CELL_SIZE, 0])
	turtle.lineTo([2 * CELL_SIZE, 0])
	turtle.lineTo([0, 4 * CELL_SIZE])
	turtle.lineTo([-6 * CELL_SIZE, 0])
	turtle.lineTo([0, - CELL_SIZE])
	turtle.arcTo([4 * CELL_SIZE, -3 * CELL_SIZE], 3 * CELL_SIZE, false)
	turtle.closePath()
	turtle.fill(ROMAN_WALL_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}


//////////////////////////////////////////
// FRANCE BULLSHIT
/////////////////////////////////////////

function franceFloor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_FLOOR_COLOR)
    }
    cell.isObstacle = false
    cell.isLink = false
    return cell
}

function franceBigPillar() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_FLOOR_COLOR)
	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.moveTo([HALF_CELL,0])
	turtle.lineTo([HALF_CELL,HALF_CELL])
	turtle.lineTo([-HALF_CELL, HALF_CELL])
	turtle.lineTo([-HALF_CELL, - HALF_CELL])
	turtle.lineTo([HALF_CELL, - HALF_CELL])
	turtle.closePath()
	turtle.fill(FRANCE_OFF_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = false
    return cell
}

function franceMedPillar() {
     let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_FLOOR_COLOR)
	drawGenRect(x, y + Math.floor(CELL_SIZE * 3 / 8), CELL_SIZE, Math.floor(CELL_SIZE / 4), FRANCE_OFF_COLOR)
	drawGenRect(x + Math.floor(CELL_SIZE * 3 / 8), y, Math.floor(CELL_SIZE / 4), CELL_SIZE, FRANCE_OFF_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = false
    return cell
}

function franceSmallPillar() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, Math.floor(CELL_SIZE / 5), FRANCE_OFF_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = false
    return cell
}



function franceWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_WALL_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = false
    return cell
}



function franceEntryPillar() {
    return franceBigPillar()
}

function franceOffColor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, FRANCE_OFF_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = false
    return cell
}
    

function franceArch() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.moveTo([-HALF_CELL - 2 * CELL_SIZE, 5 * CELL_SIZE])
	turtle.arcTo([6 * CELL_SIZE, 0], 3 * CELL_SIZE, true)
	turtle.arcTo([6 * CELL_SIZE + HALF_CELL, 3 * CELL_SIZE], 14 * CELL_SIZE, true)
	turtle.lineTo([CELL_SIZE, -CELL_SIZE])
	turtle.arcTo([3 * CELL_SIZE, 3 * CELL_SIZE], Math.floor(1.5 * CELL_SIZE * Math.sqrt(2) + 1), true)
	turtle.lineTo([-CELL_SIZE, CELL_SIZE])
	turtle.arcTo([2 * CELL_SIZE, 8 * CELL_SIZE], 14 * CELL_SIZE, true)
	turtle.lineTo([CELL_SIZE, 0])
	turtle.arcTo([-2 * CELL_SIZE, -8 * CELL_SIZE], 14 * CELL_SIZE, false)
	turtle.lineTo([CELL_SIZE, - CELL_SIZE])
	turtle.arcTo([-4 * CELL_SIZE, -4 * CELL_SIZE], Math.floor(2 * CELL_SIZE * Math.sqrt(2) + 1), false)
	turtle.lineTo([-CELL_SIZE, CELL_SIZE])
	turtle.arcTo([-6 * CELL_SIZE + HALF_CELL, -3 * CELL_SIZE], 14 * CELL_SIZE, false)
	// MIDDLE
	turtle.arcTo([-8 * CELL_SIZE, 0], 4 * CELL_SIZE, false)
	// MIDDLE
	turtle.arcTo([-6 * CELL_SIZE + HALF_CELL, 3 * CELL_SIZE], 14 * CELL_SIZE, false)
	turtle.lineTo([-CELL_SIZE, -CELL_SIZE])
	turtle.arcTo([-4 * CELL_SIZE, 4 * CELL_SIZE], Math.floor(2 * CELL_SIZE * Math.sqrt(2) + 1), false)
	turtle.lineTo([CELL_SIZE, CELL_SIZE])
	turtle.arcTo([-2 * CELL_SIZE, 8 * CELL_SIZE], 14 * CELL_SIZE, false)
	turtle.lineTo([CELL_SIZE, 0])
	turtle.arcTo([2 * CELL_SIZE, -8 * CELL_SIZE], 14 * CELL_SIZE, true)
	turtle.lineTo([-CELL_SIZE, -CELL_SIZE])
	turtle.arcTo([3 * CELL_SIZE, -3 * CELL_SIZE], Math.floor(1.5 * CELL_SIZE * Math.sqrt(2) + 1), true)
	turtle.lineTo([CELL_SIZE, CELL_SIZE])
	turtle.arcTo([6 * CELL_SIZE + HALF_CELL, -3 * CELL_SIZE], 14 * CELL_SIZE, true)
	
	//turtle.arcTo([3 * CELL_SIZE, 3 * CELL_SIZE], 3 * CELL_SIZE, true)

	turtle.closePath()
	turtle.fill(FRANCE_WALL_COLOR)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}



/////////////////////////////////////////
/////////////////////////////////////////

function egyptFloor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, EGYPT_FLOOR_COLOR)
    }
    cell.isObstacle = false
    return cell
}

function egyptWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, EGYPT_WALL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function egyptCol(size) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, EGYPT_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, size, EGYPT_COL_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function egyptBigCol() {
    return egyptCol(HALF_CELL)
}

function egyptSmallCol() {
    return egyptCol(Math.floor(HALF_CELL * 3/4))
}

function egyptPharoh() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, EGYPT_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, HALF_CELL, PHAROH_COLOR)
	drawGenRect(x, y + HALF_CELL, CELL_SIZE, HALF_CELL, PHAROH_COLOR)
    }
    cell.isObstacle = true
    return cell
}

function egyptFakeWall() {
    let cell = egyptWall()
    cell.isObstacle = false
    return cell
}

//////////////////////////////
/////////////////////////////


function endFloor(alphaP) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, END_FLOOR_COLOR)
	darkenRect(x, y, alphaP)
    }
    cell.isObstacle = false
    return cell
}

function endWall(alphaP) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, END_WALL_COLOR)
	darkenRect(x, y, alphaP)
    }
    cell.isObstacle = true
    return cell
}

function endDarkFloor() {
    return endFloor(END_DARK_ALPHA)
}

function endLightFloor() {
    return endFloor(0.0)
}

function endDarkWall() {
    return endWall(END_DARK_ALPHA)
}

function endLightWall() {
    return endWall(0.0)
}

function endTorch() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, 2 * CELL_SIZE, 2 * CELL_SIZE, END_WALL_COLOR)
	drawTorch(x, y, GREEN, BLACK)
	
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function endSage() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	let img = document.getElementById("sage")
	drawGenRect(x, y, 2 * CELL_SIZE, 2 * CELL_SIZE, END_FLOOR_COLOR)
	ctx.drawImage(img, x, y, 2 * CELL_SIZE, 2 * CELL_SIZE)/*,
		      x + 2 * CELL_SIZE, y + 2 * CELL_SIZE, 2 * CELL_SIZE, 2 * CELL_SIZE)*/
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}


////////////////////////
// OBJECTS
///////////////////////

function smallColObj(row, col) {
    let obj = Object.create(drawable)
    obj.drawImg = function(x, y, alpha) {
	drawRect(x, y, GREEK_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, Math.floor(HALF_CELL / 2), GREEK_COL_COLOR)
    }
    obj.isMoving = false
    obj.row = row
    obj.col = col
    obj.contains = obj.singleCellContains
    obj.getFrontier = obj.getSingleCellFrontier
    return obj
}

function crossObj(row, col) {
    let cross = Object.create(bigDrawable, {
	isMoving: {value:false}
    })
    cross.row = row
    cross.col = col
    cross.drawImg = function(x, y, alpha) {
	console.log("drawing cross")
	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.moveTo([0,0])
	turtle.lineTo([CELL_SIZE, 0])
	turtle.lineTo([0, CELL_SIZE])
	turtle.lineTo([CELL_SIZE, 0])
	turtle.lineTo([0, CELL_SIZE])
	turtle.lineTo([-CELL_SIZE, 0])
	turtle.lineTo([0, 2 * CELL_SIZE])
	turtle.lineTo([-CELL_SIZE, 0])
	turtle.lineTo([0, -2 * CELL_SIZE])
	turtle.lineTo([-CELL_SIZE, 0])
	turtle.lineTo([0, -CELL_SIZE])
	turtle.lineTo([CELL_SIZE, 0])
	turtle.lineTo([0, -CELL_SIZE])
	turtle.closePath()
	turtle.fill(FRANCE_OFF_COLOR)
    }

    cross.contains = function(r,c) {
	if ( (c == cross.col && !(r < cross.row) && !(r > cross.row + 3)) ||
	     (r == cross.row + 1 && !(c < cross.col - 1) && !(c > cross.col + 1))
	   ) {
	    return true
	}
	else return false
    }
    cross.getFrontier = function(dir){
	return [] //not needed, because cross shouldn't move
    }
    cross.getCells = function(r, c) {
	let cells = []
	for (i = 0; i < 4; i ++){
	    cells.push([r + i, c])
	}
	cells.push([r + 1, c - 1])
	cells.push([r + 1, c + 1])
	return cells
    }
    return cross
}



function ball(row, col, color) {
    let ball = Object.create(drawable)
    ball.drawImg = function(x, y, alpha) {
	//drawRect(x, y, FRANCE_FLOOR_COLOR)
	drawCircle(x + HALF_CELL, y + HALF_CELL, Math.floor(HALF_CELL * 3 / 4), color)
    }
    ball.isMoving = false
    ball.contains = ball.singleCellContains
    ball.getFrontier = ball.getSingleCellFrontier
    ball.row = row
    ball.col = col
    return ball
}






//////////////////////////////////////////////////
/////////////////////////////////////////////////


function basilicaCorner(row, col, dir) {
    let obj = Object.create(bigDrawable)
    obj.drawImg = function(x, y, alpha) {
	x = (dir[0] == 1) ? x : x + CELL_SIZE
	y = (dir[1] == 1) ? y : y + CELL_SIZE

	turtle.x = x
	turtle.y = y
	turtle.beginPath()
	turtle.moveTo(deltaDir([0, CELL_SIZE],dir))
	turtle.arcTo(deltaDir([CELL_SIZE, -CELL_SIZE], dir), CELL_SIZE, true)
	turtle.lineTo(deltaDir([6 * CELL_SIZE, 0], dir))
	turtle.arcTo(deltaDir([1 * CELL_SIZE, 1 * CELL_SIZE], dir), CELL_SIZE, true)
	turtle.lineTo(deltaDir([0, HALF_CELL], dir))
	turtle.arcTo(deltaDir([0, CELL_SIZE], dir), HALF_CELL, false)
	turtle.lineTo(deltaDir([0, CELL_SIZE + HALF_CELL], dir))
	turtle.lineTo(deltaDir([-2 * CELL_SIZE, 0], dir))
	let r = 2 * CELL_SIZE
	let dy = 2 * CELL_SIZE - Math.sqrt((r*r) - CELL_SIZE * CELL_SIZE)
	turtle.arcTo(deltaDir([-1 * CELL_SIZE, dy], dir), r, false)
	turtle.lineTo(deltaDir([-2 * CELL_SIZE - HALF_CELL, -2 * CELL_SIZE - dy], dir))
	turtle.lineTo(deltaDir([-HALF_CELL, HALF_CELL], dir))
	turtle.lineTo(deltaDir([2 * CELL_SIZE + dy, 2 * CELL_SIZE + HALF_CELL], dir))
	turtle.arcTo(deltaDir([-dy, CELL_SIZE], dir), 2 * CELL_SIZE, false)
	turtle.lineTo(deltaDir([0, 2 * CELL_SIZE], dir))
	turtle.lineTo(deltaDir([-1 * CELL_SIZE - HALF_CELL, 0], dir))
	turtle.arcTo(deltaDir([-CELL_SIZE, 0], dir), HALF_CELL, false)
	turtle.lineTo(deltaDir([-HALF_CELL, 0], dir))
	turtle.arcTo(deltaDir([-CELL_SIZE, -CELL_SIZE], dir), CELL_SIZE, true)
	turtle.closePath()
	turtle.fill(CORNER_OBJ_COLOR)	
    }
    obj.isMoving = false
    obj.row = row
    obj.col = col
    obj.contains = function(r,c) {
	let v = false
	obj.getCells(obj.row, obj.col).forEach(function(cell) {
	    if (cell[0] == r && cell[1] == c) v = true
	})
	return v
    }
    obj.getFrontier = function(moveDir) {
	let frontier = []
	let delta;
	let md = dumbMoveDir(moveDir,dir)
	if (md[0] == 1) {
	    delta = gridDeltaDir([0,8], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([1,8], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([2,8], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([3,8], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([4,6], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([5,5], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([6,4], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([7,4], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	}
	else if(md[0] == -1) {
	    for (row = 0; row < 8; row ++) {
		delta = gridDeltaDir([row, -1], dir)
		frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    }
	}
	else if (md[1] == 1) {
	    delta = gridDeltaDir([8,0], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([8,1], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([8,2], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([8,3], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([6,4], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([5,5], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([4,6], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    delta = gridDeltaDir([4,7], dir)
	    frontier.push([obj.row + delta[0], obj.col + delta[1]])
	}
	else if (md[1] == -1) {
	    for (col = 0; col < 8; col ++) {
		delta = gridDeltaDir([-1, col], dir)
		frontier.push([obj.row + delta[0], obj.col + delta[1]])
	    }
	}
	console.log("frontier for basilica c")
	console.log(frontier)
	return frontier
    }
    obj.getCells = function(r, c) { //rel row and col are passed
	let cells = []
	for (row = 0; row < 4; row ++) {
	    for (col = 0; col < 8; col ++) {
		let delta = gridDeltaDir([row, col], dir)
		cells.push([r + delta[0], c + delta[1]])
	    }
	}
	for (row = 4; row < 8; row ++) {
	    for (col = 0; col < 4; col ++) {
		let delta = gridDeltaDir([row,col], dir)
		cells.push([r + delta[0], c + delta[1]])
	    }
	}
	let delta = gridDeltaDir([4,4], dir)
	cells.push([r + delta[0], c + delta[1]])
	delta = gridDeltaDir([5,4], dir)
	cells.push([r + delta[0], c + delta[1]])
	delta = gridDeltaDir([4,5], dir)
	cells.push([r + delta[0], c + delta[1]])
	return cells
    }
    return obj
}
//////////////////////////////////////////////////////////////////////

function linkCodeToData(code) {
    return code.split(".")
}

function codeIsLink(code) {
    return code.split(".").length > 1
}

function codeToKey(code) {
    let data = linkCodeToData(code)
    return data[0] + "." + data[1]
}

// allows for vanilla mapping, as well as linking blank cells to
// "r.c.isObstacle" is the format for cells to be linked
function mapFromTemplate(template, cellMap, innerLinkColor, outerLinkColor) {
    // console.log(template)
  //  console.log(cellMap)
    var linkMap = new Map()
    var cellsToLink = []
    let rows = template.length
    let cols = template[0].length
    let map = new Array2d(rows, cols)
    for (row = 0; row < rows; row ++) {
	for (col = 0; col < cols; col ++) {
	    let code = template[row][col]
	    if (codeIsLink(code)) {
		cellsToLink.push({
		    row: row,
		    col: col,
		    code: code,
		})
	    }
	    else {
	//	console.log(code)
		let cell = cellMap.get(code)()
	//	console.log(cell)
		if (cell.isLink) {
		  //  console.log("is a link")
		    //console.log(`r.c=${row},${col}`)
		    //console.log(cell)
		    let str = row + "." + col
		    linkMap.set(str, {
			hasBeenDrawn: false,
			drawImg: cell.drawImg
		    })
		}
		map.add(row, col, cellMap.get(code)()) //this is calling a function :)
	    }
	}
    }
    cellsToLink.forEach(function(cellObj) {
	let data = linkCodeToData(cellObj.code)
	let transform = function(x, y) {
	    let emptyRow = cellObj.row
	    let emptyCol = cellObj.col
	    let drawRow = parseInt(data[0])
	    let drawCol = parseInt(data[1])
	    let newX = (drawCol - emptyCol) * CELL_SIZE + x
	    let newY = (drawRow - emptyRow) * CELL_SIZE + y
	    return [newX, newY]
	}
	let link = linkMap.get(codeToKey(cellObj.code))
	console.log(`code=${cellObj.code}`)
		console.log(link)
	let color = (data[3] == "true") ? outerLinkColor : innerLinkColor
	let cell = linkedCell(link, transform, data[2] === "true", color)
	map.add(cellObj.row, cellObj.col, cell) 
    })

    
    return map
}

//######################################################################
// OTHER MAP DATA
//#####################################################################
const greekCellMap = new Map()
greekCellMap.set("0", worldEdgeCell)
greekCellMap.set("1", upperPortal)
greekCellMap.set("2", bigCol)
greekCellMap.set("3", medCol)
greekCellMap.set("4", smallCol)
greekCellMap.set("5", greekWallCell)
greekCellMap.set("6", greekFloorCell)

const overworldCellMap = new Map()
overworldCellMap.set("0", worldEdgeCell)
overworldCellMap.set("1", overworldTopWall)
overworldCellMap.set("2", greekDoor)
overworldCellMap.set("3", blankNonObstacle)
overworldCellMap.set("4", romeDoor)
overworldCellMap.set("5", franceDoor)
overworldCellMap.set("6", egyptDoor)
overworldCellMap.set("7", finalDoor)
overworldCellMap.set("8", secretDoor)
overworldCellMap.set("9", overworldRightWall)
overworldCellMap.set("10", overworldLeftWall)
overworldCellMap.set("11", overworldFloor)
overworldCellMap.set("12", overworldBotWall)
overworldCellMap.set("13", torch)
overworldCellMap.set("15", blankObstacle)

const romeCellMap = new Map()
romeCellMap.set("0", worldEdgeCell)
romeCellMap.set("1", romeWall)
romeCellMap.set("2", romeFloor)
romeCellMap.set("7", romeAlcoveTop)
romeCellMap.set("8", romeAlcoveRight)
romeCellMap.set("9", romeAlcoveLeft)
romeCellMap.set("19", romeWeirdVest)
romeCellMap.set("20", lowerPortal)

const franceCellMap = new Map()
franceCellMap.set("0", worldEdgeCell)
franceCellMap.set("1", franceFloor)
franceCellMap.set("2", franceBigPillar)
franceCellMap.set("3", franceMedPillar)
franceCellMap.set("4", franceSmallPillar)

franceCellMap.set("9", franceWall)

franceCellMap.set("14", franceEntryPillar)
franceCellMap.set("15", lowerPortal)

franceCellMap.set("20", franceOffColor)

franceCellMap.set("30", franceArch)

const egyptCellMap = new Map()
egyptCellMap.set("0", worldEdgeCell)
egyptCellMap.set("1", egyptFloor)
egyptCellMap.set("2", egyptWall)
egyptCellMap.set("3", egyptBigCol)
egyptCellMap.set("4", egyptSmallCol)
egyptCellMap.set("5", egyptPharoh)
egyptCellMap.set("6", lowerPortal)
egyptCellMap.set("7", egyptFakeWall)

const endCellMap = new Map()
endCellMap.set("0", worldEdgeCell)
endCellMap.set("1", endDarkFloor)
endCellMap.set("2", endDarkWall)
endCellMap.set("3", endTorch)
endCellMap.set("4", endSage)
endCellMap.set("5", lowerPortal)
endCellMap.set("7", endLightFloor)
endCellMap.set("6", endLightWall)



		     

//###############################
// HELPER FUNCTIONS
//###############################

//if pre of post dir row/col is inside the screen, you will be drawn
function isInView(preRow, preCol, dir) {
   
   // console.log("preR,C = " + preRow + ", " + preCol)
    var postRow = drawIncRow(preRow, dir)
    var postCol = drawIncCol(preCol, dir)
    var maxR = Math.floor(SCREEN.height / CELL_SIZE)
    var maxC = Math.floor(SCREEN.width / CELL_SIZE)
    if (((preRow < 0) && (postRow < 0)) ||
	((preRow >= maxR) && (postRow >= maxR)) ||
	((preCol < 0) && (postCol < 0)) ||
	((preCol >= maxC) && (postCol >= maxC))
       ) {
//	console.log("isInView = false")
	return false
    }
    else {
//	console.log("isInView = true")
	return true
    }
}

//preCOndition: row/col/origin/dir must be valide "should be drawn"
//return [x,y]
// good for static or animation (via delta)
function gridToGlobal(row, col, delta, dir) {
    /*console.log(`r,c=[${row},${col}], delta=${delta}, dir=${dir}`)
    console.log(`${delta * dir[0] * CELL_SIZE}`)
    console.log(`${delta * dir[1] * CELL_SIZE}`)
    console.log(typeof row)
    console.log(typeof col)
    console.log(typeof delta)
    console.log(typeof dir)*/
    var x = ORIGIN.x - Math.floor(delta * dir[0] * CELL_SIZE) + col * CELL_SIZE
    var y = ORIGIN.y - Math.floor(delta * dir[1] * CELL_SIZE) + row * CELL_SIZE
   // console.log(`x,y=${x},${y}`)
    return [x,y]
}

//dir take as 1 fade down -1 fade up
function drawGradientRect(x, y, fstC, sndC, dir) {
    let fst = (dir == 1) ? y : y + CELL_SIZE
    let snd = (dir == 1) ? y + CELL_SIZE : y
    let grd = ctx.createLinearGradient(0, fst, 0, snd)
    grd.addColorStop(0,fstC)
    grd.addColorStop(1,sndC)
    let orig = ctx.fillStyle
    ctx.fillStyle = grd
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = orig
}

function darkenRect(x, y, alpha) {
    let orig = ctx.fillStyle
    let st = "rgba(0,0,0," + alpha.toString() + ")"
    ctx.fillStyle = st
   // console.log(`slpha=${alpha}, style=${ctx.fillStyle}, st=${st}`)
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = orig
}

function drawGenRect(x, y, w, h, color) {
    orig = ctx.fillStyle
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = orig  
}

function drawRect(x, y, color) {
    orig = ctx.fillStyle
    ctx.fillStyle = color
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = orig
}

function drawCircle(x, y, r, color) {
    let orig = ctx.fillStyle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = orig
}

function drawGradientCircle(x, y, r, fstC, scnC) {
    let grd = ctx.createLinearGradient(x, y, x, y - r)
    grd.addColorStop(0, fstC)
    grd.addColorStop(1, scnC)
    drawCircle(x, y, r, grd)
}

function drawGridRect(x, y, color) {
    orig = ctx.fillStyle
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = color
    let gap = Math.floor(CELL_SIZE / 10)
    ctx.fillRect(x + gap, y + gap, CELL_SIZE - 2 * gap, CELL_SIZE - 2 * gap)
  /*  ctx.fillStyle = "rgb(20,20,20)"
    ctx.font = "12px Georgia"
    ctx.fillText("(" + row + "," + col + ")",x + gap * 2, y + 5 * gap) */
    ctx.fillStyle = orig
}

function drawTorch(x, y, fstC, scnC) {
    drawGradientCircle(x + CELL_SIZE, y + Math.floor(4 / 5 * CELL_SIZE), Math.floor(CELL_SIZE * 2 / 5), fstC, scnC)
    drawGenRect(x + HALF_CELL, y + Math.floor(4 / 5 * CELL_SIZE), CELL_SIZE, Math.floor(CELL_SIZE / 5), TORCH_SILVER)
    turtle.x = x
    turtle.y = y
    turtle.beginPath()
    turtle.moveTo([Math.floor(CELL_SIZE * 3 / 4) + 6, CELL_SIZE]) //bullshit
    turtle.lineTo([HALF_CELL, 0])
    turtle.lineTo([-Math.floor(CELL_SIZE / 5), Math.floor(CELL_SIZE * 3 / 4)])
    turtle.lineTo([-Math.floor(CELL_SIZE * 2 / 5), 0])
    turtle.lineTo([-Math.floor(CELL_SIZE / 5), -Math.floor(CELL_SIZE * 3 / 4)])
    turtle.closePath()
    turtle.fill(TORCH_BROWN)
}

// code borrowed from https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
// Make a wrap text within the constraints of the box
// If you have to stop, return point in string, else return -1
function wrapText(text, x, y, maxWidth, lineHeight, maxHeight) {
 //   console.log(`text=${text} x,y=${x},${y} mxW/H = ${maxWidth},${maxHeight}`)
    var words = text.split(' ');
    var line = "";
    var pnt = 0;
    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
//	console.log(testWidth)
        if (testWidth > maxWidth && n > 0) {
	   // console.log(line)
	    ctx.fillText(line, x, y);
	    pnt += line.length
	    line = words[n] + ' ';
	    y += lineHeight;
	    if (y > maxHeight) {
		return pnt
	    }
	}
        else {
	    line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return TEXT_FINISHED
}

function wrappedTextbox(text) {
    let x = ORIGIN.x
    let y = ORIGIN.y + Math.floor(SCREEN.height * 3 / 4)
    let txtMargin = 20
    let bd = 5
    let maxWidth = SCREEN.width - txtMargin
    let maxHeight = Math.floor(SCREEN.height / 4) - txtMargin + y
    let lineHeight = 30
    let orig = ctx.fillStyle
    ctx.fillStyle = TEXT_BORDER_COLOR
    ctx.fillRect(x, y, SCREEN.width, Math.floor(SCREEN.height / 4))
    ctx.fillStyle = TEXT_BACKGROUND_COLOR
    ctx.fillRect(x + bd, y + bd, SCREEN.width - 2 * bd, Math.floor(SCREEN.height / 4) - 2 * bd)
    ctx.fillStyle = TEXT_COLOR
    ctx.font = TEXT_FONT
    console.log(ctx.font)
    let pnt = wrapText(text, x + txtMargin, y + txtMargin + 10, maxWidth, lineHeight, maxHeight)
    ctx.fillStyle = orig
    console.log(pnt)
    return pnt
    
}

function clearCanvas() {
    let orig = ctx.fillStyle
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = orig
}

function clearScreen() {
    let orig = ctx.fillStyle
    ctx.fillStyle = VOID_COLOR
    ctx.fillRect(ORIGIN.x, ORIGIN.y, SCREEN.width, SCREEN.height)
    ctx.fillStyle = orig
}

function clearNonScreen() {
    let orig = ctx.fillStyle
    ctx.fillStyle = VOID_COLOR
    ctx.fillRect(0, 0, ORIGIN.x, canvas.height)
    ctx.fillRect(0, 0, canvas.width, ORIGIN.y)
    ctx.fillRect(0, SCREEN.height + Math.floor((canvas.height - SCREEN.height) / 2), canvas.width, ORIGIN.y)
    ctx.fillRect(SCREEN.width + Math.floor((canvas.width - SCREEN.width) / 2), 0, ORIGIN.x, canvas.height)
    ctx.fillStyle = orig
}

function incRow(row, dir) {
    return row + dir[1]
}

function incCol(col, dir) {
    return col + dir[0]
}

function drawIncRow(row, dir){
    return row - dir[1]
}

function drawIncCol(col, dir) {
    return col - dir[0]
}


function singleCellPortal(row, col, world, spawn) {
    let portal = {
	contains: function(r, c) {
	    return (row === r && col === c)
	},
	world: world,
	spawn: spawn
    }
    return portal
}

function rowPortal(row, world, spawn) {
    let portal = {
	contains: function(r, c) {
	    return row == r
	},
	world: world,
	spawn: spawn
    }
    return portal
}

function  doorPortal(row, col, world, spawn) {
    let portal = {
	contains: function(r, c) {
	    return ((row == r) && ((col == c) || (col - 1 == c) || col + 1 == c))
	},
	world: world,
	spawn: spawn
    }
    return portal
}

function rowRangePortal(row, fstCol, scnCol, world, spawn) {
    let portal = {
	contains: function(r, c) {
	    return (row == r) && (c >= fstCol) && (c <= scnCol)
	},
	world: world,
	spawn: spawn
    }
    return portal
}

function checkFrontier(map, obj, row, col, dir) {
    var frontier = obj.getFrontier(dir)
    var v = true
  //  console.log(`frontier = ${frontier} type=${typeof frontier}`)
    frontier.forEach(function(coord) {
	let r = coord[0]
	let c = coord[1]
	//console.log(`frontier r,c=${r},${c}`)
	if (map.hasObstacleAt(r, c) || map.hasObjectTouching(r, c)) v = false
    })
    // console.log(`is obstacle or object on frontier? = ${v}`)
    return v
}



// ignores possibility of pushingn an object that touches a movable obj, cuz i don't plan on this happening
function canFrameShift(map, row, col, dir) {
   // console.log(`r,c=${row},${col} dir=${dir}`)
    if (row < 0 || col < 0 || row >= map.rows || col >= map.cols) {
//	console.log("can't shift: off the world")
	return false
    }
    if (!map.hasObstacleAt(row, col)) {
	//console.log("the map has no obstacle at row, col")
	if (map.hasObjectTouching(row, col)) {
	   // console.log("there's an obj touching row, col")
	    var obj = map.getObjectTouching(row, col)
	    if (obj.isMoving === false) {
	//	console.log("the obj is not moving")
		return false
	    }
	   // console.log("the object is moving")
	    return checkFrontier(map, obj, row, col, dir)
	}
//	console.log("there is no obj touching")
	let v = true
	map.objList.forEach(function(obj) {
	    if (obj.isMoving) {
		if (obj !== player && checkFrontier(map, obj, row, col, dir) == false) v = false
	    }
	})
	return v //prevent sideways collision
    }
 //   console.log("there is obstacle at row col")
    
    return false //is obstacle
}

function Array2d(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.array = new Array()
    this.get = function(row, col) {
	return this.array[row * this.cols + col]
    }
    this.add = function(row, col, data) {
	this.array[row * this.cols + col] = data
    }
}


function frameShift(map, mapOrigin, dir, movingObjects, world) {
   // console.log("in frameshift")
   // console.log(world)
    var prevLogic = keyData.logic
    keyData.logic = blockLogic
    var startTime = new Date()
  //  console.log("startTime = " + startTime.getTime())
    function animate() {
	let curTime = new Date()
	let delta = (curTime.getTime() - startTime.getTime()) / SHIFT_TIME
	//	console.log("curTime = " + curTime.getTime())
	clearScreen()
	map.draw(mapOrigin, delta, dir, [])
	movingObjects.forEach(function(obj) {
	   // console.log(obj)
	    obj.draw(mapOrigin, obj.row, obj.col, 0, dir)
	})
	clearNonScreen()
	if (curTime.getTime() - startTime.getTime() < SHIFT_TIME) {
	    window.requestAnimationFrame(animate)
	}
	else {
	    world.row = incRow(world.row, dir)
	    world.col = incCol(world.col, dir)
	    //console.log(movingObjects)
	    movingObjects.forEach(function(obj) {
		obj.row = incRow(obj.row, dir)
		obj.col = incCol(obj.col, dir)
	    })
	    //overWorld.player.inc(dir)
	    world.draw()
	    keyData.logic = prevLogic
	    let wasTriggered = false
	    world.map.triggers.forEach(function(trigger) {
		if (trigger.isTriggered()) {
		    wasTriggered = true
		    trigger.onTrigger(world.eventLogic, world.overlayCallback)
		  
		}
	    })
	    if (!wasTriggered) {
	    //order of this logic is important. if portal, nothing else should happen
		if (world.isInPortal(player.row, player.col)) {
		    world.useActivePortal(player.row, player.col)
		}
		else {
		//neither of these should block the other. prevents object drag
		    if (keyData.isKeyNew.get(GRAB)) {
			world.eventLogic(GRAB)
		    }
		    if (keyData.keyStack.length !== 0) {
			world.eventLogic(keyData.keyStack[keyData.keyStack.length - 1])
		    }
		}
	    }
	}
    }
    window.requestAnimationFrame(animate)
}

function swapActiveWorlds(world, spawn) {
   // console.log("in world swap")
    keyData.logic = blockLogic
    universe.activeWorld = world(spawn)
   // console.log(universe.activeWorld)
    universe.startGame()
}


//#####################################
// WORLD AND MAP PROTOTYPES (SORTA)
//#####################################

var mapPrototype = {
    rows: 0,
    cols: 0,
    map: null,
    draw: function(mapOrigin, delta, dir, litCells) {
	for (row = 0; row < this.rows; row++) {
	    for (col = 0; col < this.cols; col++) {	
		this.map.get(row, col).draw(mapOrigin, row, col, delta, dir, 0)
	    }
	}
	this.objList.forEach(function(obj) {
	    if (delta ===  0 || !obj.isMoving) {
		//console.log("obj not moving- " + obj.row + " " + obj.col)
		//console.log(obj)
		obj.draw(mapOrigin, obj.row, obj.col, delta, dir, 0)
	    }
	})
    },
    grab: function(row, col, val) {
	if (this.map.hasObjectAt(row, col)) {
	    this.map.getObjectAt(row, col).isMovable = val // picked up or put down
	}
    },
    hasObstacleAt: function(row, col) {
//	console.log(`r,c = ${row},${col}`)
	return this.map.get(row, col).isObstacle
    },
    hasObjectTouching: function(row, col) {
	var v = false
	this.objList.forEach(function(obj) {
	    if (obj.contains(row, col) && obj !== player) v = true
	})
	return v
    },
    getObjectTouching: function(row, col) {
	var o = null
	this.objList.forEach(function(obj) {
	    if (obj.contains(row, col)) o = obj
	})
	return o
    }
}

var worldPrototype = {
    row: 0,
    col: 0,
    light: null,
    player: player,
    centerOrigin: function(spawn) {
//	console.log("spawn " + spawn)
//	console.log(this)
//	console.log(this.map)
//	console.log(this.map.spawns)
	let playerRow = this.map.spawns[spawn][0]
	let playerCol = this.map.spawns[spawn][1]
	this.row = playerRow - CENTER_ROW
	this.col = playerCol - CENTER_COL
	player.row = playerRow
	player.col = playerCol
//	console.log(`r,c=${this.row},${this.col}, screen rc=${SCREEN.centerRow},${SCREEN.centerCol}`)
    },
    inspect: function() {
	
	
    },
    draw: function () {
	clearScreen()
//	console.log("orig [" + this.row + ", " + this.col + "]")
	this.map.draw([this.row, this.col], 0, [0,0], [])
	clearNonScreen()
    },
    isInPortal: function(row, col) {
	var v = false
	this.map.portals.forEach(function(portal) {
	    if (portal.contains(row, col)) {
	//	console.log("was in a portal")
		v = true
	    }
	})
	return v
    },
    useActivePortal: function(row, col) {
	this.map.portals.forEach(function(portal) {
	    if (portal.contains(row, col)) {
	//	console.log("swaping")
		swapActiveWorlds(portal.world, portal.spawn)
	    }
	})
    },
    eLogic: function(worldEvent) {

	if (dirMap.has(worldEvent)) {
	    let dir = dirMap.get(worldEvent)
	    let movingObjects = this.map.objList.filter(obj => obj.isMoving)
	    if (canFrameShift(this.map, incRow(player.row, dir), incCol(player.col, dir), dir)) {
		frameShift(this.map, [this.row, this.col], dir, movingObjects, this)
	    }	    
	}
	else if (worldEvent === INSPECT) {
	    let adj = player.getAdjCells()
	    var realthis = this
	    adj.forEach(function(coord) {
		let row = coord[0]
		let col = coord[1]
		//console.log(this)
		//console.log(this.map)
		let cell = realthis.map.map.get(row, col)
		if (cell.overlay !== undefined) {
		    let overlay =  cell.overlay
		    overlay.registerLogic(realthis.eventLogic)
		    overlay.registerCallback(realthis.overlayCallback)
		    overlay.step()
		}
	    })	   // overWorld.draw()
	}
	
	if (worldEvent === GRAB) {
	    var isGrabbed = !keyData.isKeyNew.get(GRAB) //ugly, backwards cuz of earlier keystack plan
	    var adj = player.getAdjCells()
	    this.map.objList.forEach(function(obj) {
		adj.forEach(function(coord) {
		    if (isGrabbed) {
			if (obj.contains(coord[0], coord[1])) obj.isMoving = true
		    }
		    else if (obj !== player) obj.isMoving = false
		})
	    })
	}
    }
}

//###########################################################
// ACTUAL WORLDS AND MAPS
//##########################################################
function isAnyObjOnCoord(objs, coord) {
    let retV = false
    let row = coord[0]
    let col = coord[1]
  //  console.log("isany being called: coords=" + coord)
    objs.forEach(function(obj) {
//	console.log(`object r,c=${obj.row},${obj.col}`)
	if (obj.row === row && obj.col === col) retV = true
    })
    return retV
}

function endMap() {
    let map = Object.create(mapPrototype)
    map.rows = 15
    map.cols = 20
    map.spawns = [[11,10]]
    map.objList = []
    map.portals = []
    map.triggers = []
    map.map = mapFromTemplate(mapData.get("end").template, endCellMap, END_FLOOR_COLOR)
    map.portals.push(rowRangePortal(13,8,11, overworld, END_SPAWN))
    let overlay = textOverlay("Oh, well hello young champion. It seems you have a keen eye for detail. You have won a great victory from this forsaken place; there is nothing left for you here. I was told to give you this code, though I must admit I don't know what it's for. https://tinyurl.com/y8funcmj")
    map.map.get(5,9).overlay = overlay
    map.map.get(5,10).overlay = overlay
    map.map.get(6,10).overlay = overlay
    map.map.get(6,9).overlay = overlay
    return map
}

function end(spawn) {
    let end = Object.create(worldPrototype, {
	map: {value: endMap()}
    })
    end.centerOrigin(spawn)
    end.map.objList.push(player)
    
    end.eventLogic = function(worldEvent) {
	end.eLogic(worldEvent)
    }
    end.overlayCallback = function() {
	 end.draw()
    }

    return end
}

function edfuMap() {
    let map = Object.create(mapPrototype)
    map.rows = 109
    map.cols = 65
    map.spawns = [[12,32]]
    map.objList = []
    map.portals = []
    map.triggers = []
    map.map = mapFromTemplate(mapData.get("egypt").template, egyptCellMap)
    map.portals.push(rowPortal(108, overworld, EGYPT_SPAWN))
    map.map.get(7,32).overlay = textOverlayVictoryTrigger(EGYPT_VICTORY_TEXT,
							  () => questProgress.egypt = SOLVED)
    console.log(map.map.get(7,32).overlay)
    return map
}

function egypt(spawn) {
    let egypt = Object.create(worldPrototype, {
	map: {value: edfuMap()}
    })
    egypt.centerOrigin(spawn)
    egypt.map.objList.push(player)
    
    egypt.eventLogic = function(worldEvent) {
	egypt.eLogic(worldEvent)
    }
    egypt.overlayCallback = function() {
	 egypt.draw()
    }

    return egypt
}

function chartesMap() {
    let map = Object.create(mapPrototype)
    map.rows = 97
    map.cols = 52
    map.spawns = [[11,36]]
    map.objList = []
    map.portals = []
    map.triggers = []
    map.map = mapFromTemplate(mapData.get("france").template, franceCellMap, FRANCE_FLOOR_COLOR, VOID_COLOR)
    map.ball1 = ball(9,13, BLUE)
    map.ball2 = ball(9,39, RED)
    map.ball3 = ball(4,26, GREEN)
    map.cross = crossObj(44,26)
    if (questProgress.france == UNSOLVED) {
	map.objList.push(map.cross)
	map.ball1 = ball(9,13, BLUE)
	map.ball2 = ball(9,39, RED)
	map.ball3 = ball(4,26, GREEN)
    }
    else {
	map.ball1 = ball(45,24, BLUE)
	map.ball2 = ball(45,28, RED)
	map.ball3 = ball(43,26, GREEN)
    }
    map.objList.push(map.ball1)
    map.objList.push(map.ball2)
    map.objList.push(map.ball3)
    map.portals.push(rowPortal(96, overworld, FRANCE_SPAWN))

    let victoryTrigger = {
	isTriggered: function() {
	    return ((map.ball1.row == 45 && map.ball1.col == 24) &&
		    (map.ball2.row == 45 && map.ball2.col == 28) &&
		    (map.ball3.row == 43 && map.ball3.col == 26) &&
		    (map.ball1.isMoving || map.ball2.isMoving || map.ball3.isMoving))
	},
	onTrigger: function(logic, callback) {
	    questProgress.france = SOLVED
	    map.objList = map.objList.filter(obj => obj !== map.cross)//kill cross
	    this.overlay.registerLogic(logic)
	    this.overlay.registerCallback(callback)
	    this.overlay.step()
	    console.log("finished step")
	},
	overlay: textOverlay(FRANCE_VICTORY_TEXT)
    }
    map.triggers.push(victoryTrigger)
    
    return map
}

function france(spawn) {
    let france = Object.create(worldPrototype, {
	map: {value: chartesMap()}
    })
    france.centerOrigin(spawn)
    france.map.objList.push(player)
    
    france.eventLogic = function(worldEvent) {
	france.eLogic(worldEvent)
    }
    france.overlayCallback = function() {
	 france.draw()
    }

    return france
}

function basilicaMap() {
    let map = Object.create(mapPrototype)
    map.rows = 67
    map.cols = 67
    map.spawns = [[63,33]]
    map.objList = []
    map.portals = []
    map.triggers = []
    map.map = mapFromTemplate(mapData.get("rome").template, romeCellMap, ROMAN_FLOOR_COLOR, VOID_COLOR)
    map.portals.push(rowPortal(64, overworld, ROME_SPAWN))
    if (questProgress.rome == UNSOLVED) {
	map.objList.push(basilicaCorner(24,25,[1,1]))
	map.objList.push(basilicaCorner(40,25,[1,-1]))
	map.objList.push(basilicaCorner(24,41,[-1,1]))
	map.objList.push(basilicaCorner(40,41,[-1,-1]))
    }
    else {
	map.objList.push(basilicaCorner(20,21,[1,1]))
	map.objList.push(basilicaCorner(44,21,[1,-1]))
	map.objList.push(basilicaCorner(20,45,[-1,1]))
	map.objList.push(basilicaCorner(44,45,[-1,-1]))
    }
	
    var victoryTrigger = {
	isTriggered: function() {
	    //console.log("is trigger being called"
	    console.log(map.objList)
	    if ((map.objList[0].row == 20 && map.objList[0].col == 21) &&
		(map.objList[1].row == 44 && map.objList[1].col == 21) &&
		(map.objList[2].row == 20 && map.objList[2].col == 45) &&
		(map.objList[3].row == 44 && map.objList[3].col == 45) &&
		((map.objList[0].isMoving || map.objList[1].isMoving ||
		  map.objList[2].isMoving || map.objList[3].isMoving))
	       ) {
		return true
	    }
	    return false
	},
	onTrigger: function(logic, callback) {
	    questProgress.rome = SOLVED
	    this.overlay.registerLogic(logic)
	    this.overlay.registerCallback(callback)
	    this.overlay.step()
	    
	},
	overlay: textOverlay(ROMAN_VICTORY_TEXT)
    }

    map.triggers.push(victoryTrigger)
  //  map.triggers.push(progressTrigger)
    
    return map
}

function rome(spawn) {
    let rome = Object.create(worldPrototype, {
	map: {value: basilicaMap()}
    })
    rome.centerOrigin(spawn)
    rome.map.objList.push(player)
    
    rome.eventLogic = function(worldEvent) {
	rome.eLogic(worldEvent)
    }
    rome.overlayCallback = function() {
	rome.draw()
    }

    return rome
}


function parthenonMap() {
    let map = Object.create(mapPrototype)
    map.rows = 53
    map.cols = 27
    map.spawns = [[1,13]]
    map.objList = []
    map.portals = []
    map.triggers = []
   // map.portals.push(singleCellPortal(0,0,overWorld, SECRET_SPAWN))
   // console.log(map.portals)
    map.map = mapFromTemplate(mapData.get("greece").template, greekCellMap)
    if (questProgress.greece === UNSOLVED) {
	map.objList.push(smallColObj(8, 8))
	map.objList.push(smallColObj(8, 18))
    }
    else {
	map.objList.push(smallColObj(31, 11))
	map.objList.push(smallColObj(31, 15))
    }
    
 
    var victoryTrigger = {
	winCoords: [[31,11],[31,15]],
	isTriggered: function() {
	    console.log("is trigger being called")
	    var c1 = map.objList[0]
	    var c2 = map.objList[1] //tkw
	    if (isAnyObjOnCoord([c1,c2], this.winCoords[0]) &&
		isAnyObjOnCoord([c1,c2], this.winCoords[1])){ //on must have been just put there
		if (c1.isMoving || c2.isMoving)	return true
	    }
	    return false
	},
	onTrigger: function(logic, callback) {
	    questProgress.greece = SOLVED
	    this.overlay.registerLogic(logic)
	    this.overlay.registerCallback(callback)
	    this.overlay.step()
	    
	},
	overlay: textOverlay(GREEK_VICTORY_TEXT)
    }
    map.triggers.push(victoryTrigger)
    map.portals.push(rowPortal(0, overworld, GREECE_SPAWN))

    return map
}

function greece(spawn) {
    let greece = Object.create(worldPrototype, {
	map: {value: parthenonMap()}
    })
    greece.centerOrigin(spawn)
    greece.map.objList.push(player)
    
    greece.eventLogic = function(worldEvent) {
	greece.eLogic(worldEvent)
    }
    greece.overlayCallback = function() {
	greece.draw()
    }

    return greece
    
}



function overworldMap() {
    let map = Object.create(mapPrototype)
    map.rows = 17
    map.cols = 26 * 4
    map.spawns = [[10,6],
		  [7,13],
		  [7,26],
		  [7,39],
		  [7,52],
		  [7,66]
		  ]
    map.objList = []
    map.triggers = []
    map.portals = []
    map.map = mapFromTemplate(mapData.get("overworld").template, overworldCellMap)
    map.portals.push(doorPortal(6,13,greece, MAIN_SPAWN))
    map.portals.push(doorPortal(6, 26, rome, MAIN_SPAWN))
    map.portals.push(doorPortal(6, 39, france, MAIN_SPAWN))
    map.portals.push(doorPortal(6, 52, egypt, MAIN_SPAWN))
    map.portals.push(rowRangePortal(6, 65, 68, end, MAIN_SPAWN))

    if (totalVictory()) {
	map.map.get(6,65).isObstacle = false
	map.map.get(6,66).isObstacle = false
	map.map.get(6,67).isObstacle = false
	map.map.get(6,68).isObstacle = false
    }
    //map.map.get(4,5).overlay = textOverlay(TEST_STRING)
  //  console.log(map.map)
    return map
}
	    
 

function overworld(spawn) {
    let overworld = Object.create(worldPrototype, {
	map: {value: overworldMap()}	
    })
    overworld.centerOrigin(spawn)
    overworld.map.objList.push(player)
    overworld.overlayCallback = function() {
	overworld.draw()
    }
    overworld.eventLogic = function(worldEvent) {
	overworld.eLogic(worldEvent)
    }
    return overworld
}

var universe = {
    activeWorld: null,
    startGame:  function() {
	keyData.logic = this.activeWorld.eventLogic
	this.activeWorld.draw()
    }, 
}

function createUniverse() {
    registerEventListeners()
    universe.activeWorld = overworld(MAIN_SPAWN)
    universe.startGame()
}


//######################################333333333333333333333333333333333333333
// LOADING AJAX STUFF AND KICK STARTING THE GAME
//############################################################################
var ajaxCompleted = 0
var ajaxMax = 6 //wtf why don't work?

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (window.mobilecheck()) {
    document.getElementById("error").style.display = block
    document.getElementById("canvas").style.display = none
}
else {
    
    
    for (const name of mapData.keys()) {
	var req = new XMLHttpRequest()
	req.addEventListener("load", function() {
	    let obj = JSON.parse(this.responseText)
//	console.log(obj)
	    mapData.get(name).template = obj
	    ajaxCompleted ++
	    if (ajaxCompleted >= ajaxMax) {
		createUniverse()
	    }
	})
	req.open("GET", mapData.get(name).path)
	req.send()
    }
}



