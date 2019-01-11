var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext("2d")
}

canvas.height = Math.floor(window.innerHeight / 4 * 3)
canvas.width = Math.floor(window.innerWidth / 4 * 3)


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


const BACKGROUND_COLOR = BLACK
const TEXT_BACKGROUND_COLOR = "rgb(222,184,135)"
const TEXT_FONT = "20px Arial"
const TEXT_COLOR = "rgb(0,0,0)"

const GREEK_FLOOR_COLOR = LIGHT_GREY
const GREEK_WALL_COLOR = SILVER
const GREEK_COL_COLOR = SIENNA
const PORTAL_COLOR = HOT_PINK



const TEST_STRING = "hello, my name is joe, I want to tell you all about what I have been up to lately. I have to make way more filler text than I expected which is why none of this means anything unless you subscribe to iceberg theory where even if I'm not trying to inject any meaning, tunconscious event in my mind influence my writing in a such a way as to make my opinion about my work irrelevant"
const TO_STRING = "You can't tell what's different, but the world is not the same as it just was...."
const GREEK_VICTORY_TEXT = "You feel a rumbling deep in the earth. Something has important has happened somewhere, and you feel that your task here is complete."



//####################################
// CONST VALUES
//###################################

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


const questProgress = {
    greece: UNSOLVED,
    france: UNSOLVED,
    egypt: UNSOLVED,
    rome: UNSOLVED
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

function rock(row, col) {
    var rock = Object.create(drawable, {
    row: {value: row,
	  writable: true
	 },
    col: {value: col,
	  writable: true
	 },
    drawImg: {value: function(x, y, alpha) {
	drawGridRect(x, y, "rgb(0,255,0)")
    }},
    isMoving: {value: false,
		 writable: true
		},
    })
    rock.contains = function(row, col) {
	return rock.row === row && rock.col === col
    }
    rock.getFrontier = function(dir) {
	return [[incRow(rock.row, dir), incCol(rock.col, dir)]]
    }
    return rock
}

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
	    keyData.logic = overlay.prevLogic
	    overlay.callback()
	    overlay.textpnt = 0
	    overlay.curText = overlay.text
	}	
    }
    return overlay    
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

function portalCell() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGridRect(x, y, PORTAL_COLOR)
    }
    cell.isObstacle = false
    return cell
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

function greekDoor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, CELL_SIZE * 3, CELL_SIZE * 3, SILVER)
    }
    cell.isObstacle = false
    cell.isLink = true
    return cell
}

function romeDoor() {
    return greekDoor()
}

function franceDoor() {
    return greekDoor()
}

function egyptDoor() {
    return greekDoor()
}

function finalDoor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, CELL_SIZE * 4, CELL_SIZE * 6, SILVER)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function secretDoor() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawGenRect(x, y, CELL_SIZE * 2, CELL_SIZE * 2, SILVER)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function overworldTopWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, SIENNA)
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
	drawRect(x, y, RED)
    }
    cell.isObstacle = true
    return cell
}

function specialTorch() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, ORANGE)
    }
    cell.isObstacle = true
    return cell
}

function overworldFloor() {
    return greekFloorCell()
}

//////////////////////////////////////////

function linkedCell(link, transform, isObstacle) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	if (!link.hasBeenDrawn) {
	    let coord = transform(x, y)
	    link.drawImg(coord[0], coord[1], alpha)
	}
    }
    cell.isObstacle = isObstacle
    return cell
}

function romeAlcove(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, HOT_PINK)
    }
    cell.isObstacle = true
    cell.isLink = true
    return cell
}

function romeAlcoveTop() {
    return romeAlcove([0,-1])
}

function romeAlcoveRight() {
    return romeAlcove([1,0])
}

function romeAlcoveLeft() {
    return romeAlcove([-1, 0])
}

////
function romeFloorImg(dir) {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, BLUE)
    }
    cell.isObstacle = false
    cell.isLink = true
    return cell
}

function romeFloorImgTL() {
    return romeFloorImg([1,1])
}

function romeFloorImgTR() {
    return romeFloorImg([-1,1])
}

function romeFloorImgBL() {
    return romeFloorImg([1,-1])
}

function romeFloorImgBR() {
    return romeFloorImg([-1,-1])
}
////

function romeWall() {
    let cell = Object.create(drawable)
    cell.drawImg = function(x, y, alpha) {
	drawRect(x, y, SIENNA)
    }
    cell.isObstacle = true
    return cell
}

function romeFloor() {
    return greekFloorCell()
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
	drawRect(x, y, HOT_PINK)
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
	drawRect(x, y, HOT_PINK)
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

function deltaDir(delta, dir) {
    let index = Math.floor(Math.abs(dir[0] + dir[1]) / 2)
    let x = delta[1 - index] * dir[0]
    let y = delta[index] * dir[1]
    return [x, y]
}

function dist(p0,p1) {
    let sum = 0
    for (i = 0; i < p0.length; i ++) {
	sum += Math.pow(Math.abs(p0[i] - p1[i]), 2)
    }
    return Math.sqrt(sum)
}

var turtle = {
    x: 0,
    y: 0,
    beginPath: function() {
	cx.beginPath()
    }
    moveTo: function(delta) {
	this.x += delta[0]
	this.y += delta[1]
	cx.moveTo(this.x, this.y)
	
    },
    lineTo: function(delta) {
	this.x += delta[0]
	this.y += delta[1]
	cx.lineTo(this.x, this.y)
    },
    arcTo: function(delta, radius) {
	let d = dist([this.x, this.y], [this.x + delta[0], this.y + delta[1]])
	let theta = Math.asin(d / 2 / radius) * 2
    },
    closePath: function() {
	cx.closePath()
    }
    stroke: function(color) {
	let orig = cx.strokeStyle
	cx.strokeStyle = color
	cx.stroke()
	cx.strokeStyle = orig
    }
    fill: function(color) {
	let orig = cx.fillStyle
	cx.fillStyle = color
	cx.fill()
	cx.fillStyle = orig
    }
}

function basilicaCorner(row, col, dir) {
    let obj = Object.create(drawable)
    obj.drawImg = function(x, y, alpha) {
	x = (dir[0] == 1) ? x : x + CELL_SIZE
	y = (dir[1] == 1) ? y : y + CELL_SIZE

	let orig = cx.fillStyle
	cx.strokeStyle = BLUE
	cx.beginPath()
	let delta = deltaDir([0, CELL_SIZE],dir)
	cx.moveTo(x + delta[0], y + delta[1])
	let deltap = deltaDir([CELL_SIZE, 0], dir) //first corner
	cx.arcTo(x, y, x + deltap[0], y + deltap[1], CELL_SIZE)
	delta = deltaDir([7 * CELL_SIZE, 0], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	delta = deltaDir([8 * CELL_SIZE, 0], dir)
	deltap = deltaDir([8 * CELL_SIZE, 1 * CELL_SIZE], dir)
	cx.arcTo(x + delta[0], y + delta[1], x + deltap[0], y + deltap[1], CELL_SIZE)
	delta = deltaDir([8 * CELL_SIZE, CELL_SIZE + HALF_CELL], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	delta = deltaDir([6 * CELL_SIZE + HALF_CELL, 2 * CELL_SIZE], dir)
	deltap = deltaDir([8 * CELL_SIZE, 2 * CELL_SIZE + HALF_CELL], dir)
	cx.arcTo(x + delta[0], y + delta[1], x + deltap[0], y + deltap[1], HALF_CELL)
	delta = deltaDir([8 * CELL_SIZE, 4 * CELL_SIZE], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	deltap = deltaDir([5 * CELL_SIZE, 4 * CELL_SIZE + HALF_CELL], dir) //  for the inner quarter circle
	delta = deltaDir([6 * CELL_SIZE, 4 * CELL_SIZE], dir)// outer point
	cx.arcTo(x + delta[0], y + delta[1], x + deltap[0], y + deltap[1], 4 * CELL_SIZE)
	delta = deltaDir([2 * CELL_SIZE, 1 * CELL_SIZE], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	delta = deltaDir([1 * CELL_SIZE, 2 * CELL_SIZE], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	delta = deltaDir([4 * CELL_SIZE + HALF_CELL, 5 * CELL_SIZE], dir)
	deltap = deltaDir([4 * CELL_SIZE, 6 * CELL_SIZE], dir)
	cx.lineTo(x + delta[0], y + delta[1])
	d = deltaDir([4 * CELL_SIZE, 8 * CELL_SIZE], dir)
	//cx.moveTo(x + d[0], y + d[1])
	//cx.arcTo(x + deltap[0], y + deltap[1], x + delta[0], y + delta[1], 4 * CELL_SIZE)
	//trying form the other side
	d = deltaDir([0, 1 * CELL_SIZE], dir)
	delta = deltaDir([0, 7 * CELL_SIZE], dir)
	cx.moveTo(x + d[0], y + d[1])
	cx.lineTo(x + delta[0], y + delta[1])
	delta = delta
	cx.stroke()
	cx.fillStyle = orig

	
    }
    obj.isMoving = false
    obj.row = row
    obj.col = col
    obj.contains = function(r,c) {

    }
    obj.getFrontier = function(dir) {
	
    }
    return obj
}

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
function mapFromTemplate(template, cellMap) {
    // console.log(template)
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
		let cell = cellMap.get(code)()
	//	console.log(cell)
		if (cell.isLink) {
		    console.log("is a link")
		    console.log(`r.c=${row},${col}`)
		    console.log(cell)
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
	let cell = linkedCell(link, transform, data[2] === "true")
	map.add(cellObj.row, cellObj.col, cell) 
    })

    
    return map
}

//######################################################################
// OTHER MAP DATA
//#####################################################################
const greekCellMap = new Map()
greekCellMap.set("0", worldEdgeCell)
greekCellMap.set("1", portalCell)
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
overworldCellMap.set("14", specialTorch)
overworldCellMap.set("15", blankObstacle)

const romeCellMap = new Map()
romeCellMap.set("0", worldEdgeCell)
romeCellMap.set("1", romeWall)
romeCellMap.set("2", romeFloor)
romeCellMap.set("3", romeFloorImgTL)
romeCellMap.set("4", romeFloorImgTR)
romeCellMap.set("5", romeFloorImgBR)
romeCellMap.set("6", romeFloorImgBL)
romeCellMap.set("7", romeAlcoveTop)
romeCellMap.set("8", romeAlcoveRight)
romeCellMap.set("9", romeAlcoveLeft)
romeCellMap.set("10", romeCornerTL)
romeCellMap.set("11", romeCornerTR)
romeCellMap.set("12", romeCornerBR)
romeCellMap.set("13", romeCornerBL)
romeCellMap.set("14", romeSquare)
romeCellMap.set("15", romeMiddleRectLeft)
romeCellMap.set("16", romeMiddleRectRight)
romeCellMap.set("17", romeVestLeft)
romeCellMap.set("18", romeVestRight)
romeCellMap.set("19", romeWeirdVest)
romeCellMap.set("20", portalCell)


		     

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

function drawGenRect(x, y, w, h, color) {
    orig = cx.fillStyle
    cx.fillStyle = color
    cx.fillRect(x, y, w, h)
    cx.fillStyle = orig  
}

function drawRect(x, y, color) {
    orig = cx.fillStyle
    cx.fillStyle = color
    cx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    cx.fillStyle = orig
}

function drawCircle(x, y, r, color) {
    let orig = cx.fillStyle
    cx.fillStyle = color
    cx.beginPath()
    cx.arc(x, y, r, 0, Math.PI * 2)
    cx.fill()
    cx.fillStyle = orig
}

function drawGridRect(x, y, color) {
    orig = cx.fillStyle
    cx.fillStyle = "rgb(0,0,0)"
    cx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    cx.fillStyle = color
    let gap = Math.floor(CELL_SIZE / 10)
    cx.fillRect(x + gap, y + gap, CELL_SIZE - 2 * gap, CELL_SIZE - 2 * gap)
  /*  cx.fillStyle = "rgb(20,20,20)"
    cx.font = "12px Georgia"
    cx.fillText("(" + row + "," + col + ")",x + gap * 2, y + 5 * gap) */
    cx.fillStyle = orig
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
        var metrics = cx.measureText(testLine);
        var testWidth = metrics.width;
//	console.log(testWidth)
        if (testWidth > maxWidth && n > 0) {
	   // console.log(line)
	    cx.fillText(line, x, y);
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
    cx.fillText(line, x, y);
    return TEXT_FINISHED
}

function wrappedTextbox(text) {
    let x = ORIGIN.x
    let y = ORIGIN.y + Math.floor(SCREEN.height / 2)
    let txtMargin = 20
    let maxWidth = SCREEN.width - 2 * txtMargin
    let maxHeight = Math.floor(SCREEN.height / 2) - 2 * txtMargin + y
    let lineHeight = 30
    let orig = cx.fillStyle
    cx.fillStyle = TEXT_BACKGROUND_COLOR
    cx.fillRect(x, y, SCREEN.width, Math.floor(SCREEN.height / 2))
    cx.fillStyle = TEXT_COLOR
    cx.font = TEXT_FONT
    console.log(cx.font)
    let pnt = wrapText(text, x + txtMargin, y + txtMargin, maxWidth, lineHeight, maxHeight)
    cx.fillStyle = orig
    console.log(pnt)
    return pnt
    
}

function clearCanvas() {
    let orig = cx.fillStyle
    cx.fillStyle = BACKGROUND_COLOR
    cx.fillRect(0, 0, canvas.width, canvas.height)
    cx.fillStyle = orig
}

function clearScreen() {
    let orig = cx.fillStyle
    cx.fillStyle = "rgb(100,100,100)"
    cx.fillRect(ORIGIN.x, ORIGIN.y, SCREEN.width, SCREEN.height)
    cx.fillStyle = orig
}

function clearNonScreen() {
    let orig = cx.fillStyle
    cx.fillStyle = BACKGROUND_COLOR
    cx.fillRect(0, 0, ORIGIN.x, canvas.height)
    cx.fillRect(0, 0, canvas.width, ORIGIN.y)
    cx.fillRect(0, SCREEN.height + Math.floor((canvas.height - SCREEN.height) / 2), canvas.width, ORIGIN.y)
    cx.fillRect(SCREEN.width + Math.floor((canvas.width - SCREEN.width) / 2), 0, ORIGIN.x, canvas.height)
    cx.fillStyle = orig
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
    var portal = {
	contains: function(r, c) {
	    return (row === r && col === c)
	},
	world: world,
	spawn: spawn
    }
    return portal
}



// ignores possibility of pushingn an object that touches a movable obj, cuz i don't plan on this happening
function canFrameShift(map, row, col, dir) {
   // console.log(`r,c=${row},${col} dir=${dir}`)
    if (row < 0 || col < 0 || row >= map.rows || col >= map.cols) {
//	console.log("can't shift: off the world")
	return false
    }
    if (!map.hasObstacleAt(row, col)) {
//	console.log("the map has no obstacle at row, col")
	if (map.hasObjectTouching(row, col)) {
	  //  console.log("there's an obj touching row, col")
	    var obj = map.getObjectTouching(row, col)
	    if (obj.isMoving === false) {
	//	console.log("the obj is not moving")
		return false
	    }
	   // console.log("the object is moving")
	    var frontier = obj.getFrontier(dir)
	    var v = true
	   // console.log(`frontier = ${frontier} type=${typeof frontier}`)
	    frontier.forEach(function(coord) {
		let r = coord[0]
		let c = coord[1]
	//	console.log(`frontier r,c=${r},${c}`)
		if (map.hasObstacleAt(r, c) || map.hasObjectTouching(r, c)) v = false
	    })
	   // console.log(`is obstacle or object on frontier? = ${v}`)
	    return v
	}
//	console.log("there is no obj touching")
	return true //no obstacle, no obj
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
	    world.map.triggers.forEach(function(trigger) {
		if (trigger.isTriggered()) {
		    trigger.onTrigger(world.eventLogic, world.overlayCallback)
		    /*trigger.overlay.registerLogic(world.eventLogic)
		    trigger.overlay.registerCallback(world.overlayCallback)
		    trigger.overlay.step()*/
		}
	    })
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
	    if (obj.contains(row, col)) v = true
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
	console.log("spawn " + spawn)
	console.log(this)
	console.log(this.map)
	console.log(this.map.spawns)
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
		if (cell.overlay !== null) {
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

function basilicaMap() {
    let map = Object.create(mapPrototype)
    map.rows = 67
    map.cols = 67
    map.spawns = [[62,33]]
    map.objList = []
    map.portals = []
    map.triggers = []
    map.map = mapFromTemplate(mapData.get("rome").template, romeCellMap)
    map.portals.push(singleCellPortal(63, 33, overworld, ROME_SPAWN))
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
    map.portals.push(singleCellPortal(0,12, overworld, GREECE_SPAWN))

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
    map.spawns = [[10,3],
		  [7,13],
		  [7,26],
		  [7,39],
		  [7,52]
		  ]
    map.objList = []
    map.triggers = []
    map.portals = []
    map.map = mapFromTemplate(mapData.get("overworld").template, overworldCellMap)
    map.portals.push(singleCellPortal(6,12,greece, MAIN_SPAWN))
    map.portals.push(singleCellPortal(6, 26, rome, MAIN_SPAWN))
    map.objList.push(basilicaCorner(7,2,[1,1]))
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
var ajaxMax = 3 //wtf why don't work?


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


/*clearCanvas()
clearScreen()
let pnt = wrappedTextbox(TEST_STRING)
console.log(TEST_STRING.slice(pnt, TEST_STRING.length))
*/

