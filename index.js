var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext("2d")
}

canvas.height = Math.floor(window.innerHeight / 4 * 3)
canvas.width = Math.floor(window.innerWidth / 4 * 3)



const BACKGROUND_COLOR = "rgb(0,0,0)"

const CELL_SIZE = 40
const SHIFT_TIME = 500 // in millis
const SCREEN = {
    width: 400,
    height: 400
}
const ORIGIN = {
    x: Math.floor((canvas.width - SCREEN.width) / 2),
    y: Math.floor((canvas.height - SCREEN.height) / 2)
}

const SOLVED = 1;
const UNSOLVED = 2;
const PRIMARY = 73 // "i"
const SECONDARY = 71// "g"
const INSPECT = "inspect"
const GRAB = "grab"
const LEFT = "left"
const RIGHT = "right"
const UP = "up"
const DOWN = "down"

const dirMap = new Map()
dirMap.set(LEFT, [-1, 0])
dirMap.set(UP, [0, -1])
dirMap.set(RIGHT, [1, 0])
dirMap.set(DOWN, [0, 1])


/*
class Obj {
    draw(x, y, alpha)
    getBoundary()
    getOrigin() grid ref

    - isMoveable
    - isMoving
    - x, y
}

class Map {
    draw(x, y, lightGetData()) x,y are global
    grab(x, y) refer to grid, not global
    inspect(x, y) grid ref
    isObstacleAt(x, y)
    getObjectAt(x, y)
    hasObject
    gridToGlobal(x, y, row, col) return x, y
}

class World {
    isCollision(x, y)
    
    - (int, int)  origin  (origin is boundary of last shade before back (alpha ref))
    - (int, int) screen  (yeeeeeah)
    - [obj] objList

function frameShifter(map, origSrc, origTrg, dir, movingObjects, callback) {
    loop: stepMap() drawObjects
    objects.isMoving = false
    removeObj from src grid, add to trg grid
    update objOrig
    callback
}

*/

//##################################
// IMPORTANT OBJECTS
//##################################
var keyData =  {
    keyStack: new Array(),
    isKeyNew:  new Map(),
    logic: null
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
    }
}


//##################################################3



/*function QuestProgress() {
    this.levelsCompleted = {"parthenon": false,
			     "basilica": false,
			     "edu": false,
			     "christ": false
			    }
}*/


/*var player = {
    row: 0,
    col: 0,
    dir: [0,1],
    draw: function(mapOrigin, row, col, alpha) {
	drawCellRect(mapOrigin, row, col, "rgb(255,0,0)")
	console.log("in draw")
    },
    isMoveable: true,
    isMoving: false
}*/

var cellPrototype = {
    draw: function(mapOrigin, row, col, delta, dir, alpha) {
	//console.log("row,col =  " + row + ", " + col)
	let relRow = row - mapOrigin[0]
	let relCol = col - mapOrigin[1]
	if (isInView(relRow, relCol, dir)) {
	    let coord = gridToGlobal(relRow, relCol, delta, dir)
	   // console.log("coord = " + coord)
	    //console.log("row,col = " + row + ", " + col)
	    drawGridRect(coord[0], coord[1], relRow, relCol, "rgb(0,255,255)")//default
	}
    },
    isObstacle: false,
    object: null
}

function emptyCell() {
    let cell = Object.create(cellPrototype)
    return cell
}


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
    var x = ORIGIN.x - Math.floor(delta * dir[0] * CELL_SIZE) + col * CELL_SIZE
    var y = ORIGIN.y - Math.floor(delta * dir[1] * CELL_SIZE) + row * CELL_SIZE
    return [x,y]
}

function drawGridRect(x, y, row, col, color) {
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




/*function canFrameShift(map, row, col, dir) {
    console.log("in canframeshift")
    if (!map.hasObjectAt(row, col)) {
	console.log("map does not have object at rowcol")
	return !map.isObstacleAt(row, col)
    }
    else {
	if (map.getObjectAt(row, col).isMovable) {
	    while(map.hasObjectAt(row, col)) {
		row = incRow(row, dir)
		col = incCol(col, dir)
	    }
	    return map.isObstacleAt(row, col)
	}
	else return false
    }
}*/

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
    },
    grab: function(row, col, val) {
	if (this.map.hasObjectAt(row, col)) {
	    this.map.getObjectAt(row, col).isMovable = val // picked up or put down
	}
    },
    inspect: function(row, col) {
	console.log("inspect")
    },
    isObstacleAt: function(row, col) {
	return this.map.get(row, col).isObstacle
    },
    getObjectAt: function(row, col) {
	return this.map.get(row, col).object
    },
    hasObjectAt: function(row, col) {
	console.log("has object = ")
	console.log(this.map.get(row, col).object !== null)
	console.log(this.map.get(row,col))
	return this.map.get(row, col).object !== null
    },
    addObject: function(row, col, obj) {
	this.map.get(row, col).object = obj
	obj.row = row
	obj.col = col
    }
}

var worldPrototype = {
    row: 5,
    col: 5,
    map: null,
    light: null,
    objList: [],
   // player: player,
    eventLogic: function(worldEvent) {
	console.log(worldEvent) // TO BE REPLACED BY EACH WORLD
    },
    draw: function () {
	clearScreen()
//	console.log("orig [" + this.row + ", " + this.col + "]")
	this.map.draw([this.row, this.col], 0, [0,0], [])
//	this.player.draw([this.row, this.col], this.player.row, this.player.col, 0)
    },
    checkPortals: function(row, col) {
	this.map.portals.forEach(function(portal) {
	    if (portal.row == row && portal.col == col) {
		
	    }
	})
    }
}

//###########################################################
// ACTUAL WORLDS AND MAPS
//##########################################################


function overWorldMap(progress) {
    let map = Object.create(mapPrototype)
    map.rows = 20
    map.cols = 20
    map.map = new Array2d(map.rows, map.cols)
    for (row = 0; row < map.map.rows; row++) {
	for (col = 0; col < map.map.cols; col++) {
	    var newCell = emptyCell()
	    map.map.add(row, col, newCell)
	}
    }
  //  console.log(map.map)
    return map
}
	    
 

function overWorld(progress, frameShift) {
    let overWorld = Object.create(worldPrototype, {
	map: {value: overWorldMap(progress)}	
    })
    overWorld.eventLogic = function(worldEvent) {
	if (dirMap.has(worldEvent)) {
	   /* if(canFrameShift(overWorld.map, overWorld.row, overWorld.col, dirMap.get(worldEvent))) {
		console.log("can frame shift")
		var movingObjects = overWorld.objList.filter(obj => obj.isMoving)
		var dir = dirMap.get(worldEvent)
		frameShift(overWorld.map, [overWorld.row, overWorld.col], dir,
			   movingObjects)
		overWorld.row = incRow(overWorld.row, dir)
		overWorld.col = incCol(overWorld.col, dir)
		overWorld.draw()
		}*/
	    let dir = dirMap.get(worldEvent)
	    frameShift(overWorld.map, [overWorld.row, overWorld.col], dir)
	    overWorld.row = incRow(overWorld.row, dir)
	    overWorld.col = incCol(overWorld.col, dir)
	    overWorld.draw()
	}
	else if (worldEvent === PRIMARY) {
	   // overWorld.map.inspect(incRow(player.row, player.dir), incCol(player.col, player.dir))
	    overWorld.draw()
	}
	else if (worldEvent === SECONDARY) {
	    //no objects to push here
	}
    }	
   // overWorld.map.addObject(0, 1, overWorld.player)
    return overWorld
}

function frameShift(map, mapOrigin, dir) {
    // console.log("in frame shift")
    //console.log(mapOrigin)
    //console.log(dir)
    //animate the map shifting place, have moving objects drawn where they started
    // update the moving objects to their new location
    // tell the world it's new origin
   /* movingObjects.forEach(function(obj) {
	obj.row = incRow(obj.row, dir)
	obj.col = incCol(obj.col, dir)
	})*/
    var startTime = new Date()
  //  console.log("startTime = " + startTime.getTime())
    function animate() {
	let curTime = new Date()
	let delta = (curTime.getTime() - startTime.getTime()) / SHIFT_TIME
	//	console.log("curTime = " + curTime.getTime())
	clearScreen()
	map.draw(mapOrigin, delta, dir, [])
	clearNonScreen()
	if (curTime.getTime() - startTime.getTime() < SHIFT_TIME) {
	    window.requestAnimationFrame(animate)
	}
    }
    window.requestAnimationFrame(animate)
    
}

var universe = {
   // questProgress: new QuestProgress(),
   // questTriggers: [],
   // overlays: [],
    activeWorld: overWorld(this.questProgress, frameShift),
    startGame:  function() {
	registerEventListeners()
	keyData.logic = this.activeWorld.eventLogic
	this.activeWorld.draw()
    },
    /*changeEventLogic: function(logic) {
	keyData.logic = logic
    },
    addOverlay: function(overlay) {
	this.overlays.push(overlay)
    },
    removeOverlay: function(overlay) {
	this.overlays.splice(this.overlays.indexOf(overlay), 1)
    }*/
    
}

universe.startGame()
