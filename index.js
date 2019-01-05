var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext("2d")
}

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const CELL_SIZE = 20
const ORIGIN = {x: 10,
		y: 10
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

function QuestProgress() {
    this.levelsCompleted = {"parthenon": false,
			     "basilica": false,
			     "edu": false,
			     "christ": false
			    }
}


var player = {
    row: 0,
    col: 0,
    dir: [0,1],
    draw: function(mapOrigin, row, col, alpha) {
	drawCellRect(mapOrigin, row, col, "rgb(255,0,0)")
	console.log("in draw")
    },
    isMoveable: true,
    isMoving: false
}

var cellPrototype = {
    draw: function(mapOrigin, row, col, alpha) {
	drawCellRect(mapOrigin, row, col, "rgb(0,255,0)")//default
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

//gives leeway of one cell for "are you in the screen?"
function isInView(mapOrigin, row, col) {
    var newRow = row - mapOrigin[0]
    var newCol = col - mapOrigin[1]
    if ((newRow < -1) || (newRow > Math.floor(canvas.width / CELL_SIZE) + 1) ||
	(newCol < -1) || (newCol > Math.floor(canvas.height / CELL_SIZE) + 1)) {
	return false
    }
    else return true
}

function drawCellRect(mapOrigin, row, col, color) {
    if (isInView(mapOrigin, row, col)) {
	var coord = gridToGlobal(row - mapOrigin[0], col - mapOrigin[1])
	orig = cx.fillStyle
	cx.fillStyle = color
	cx.fillRect(coord[0], coord[1], CELL_SIZE, CELL_SIZE)
	cx.fillStyle = orig
    }
}

function incRow(row, dir) {
    return row + dir[0]
}

function incCol(col, dir) {
    return col + dir[1]
}

function canFrameShift(map, row, col, dir) {
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

function gridToGlobal(row, col) {
    var x = ORIGIN.x + col * CELL_SIZE
    var y = ORIGIN.y + row * CELL_SIZE
    return [x, y]
}



//#####################################
// WORLD AND MAP PROTOTYPES (SORTA)
//#####################################

var mapPrototype = {
    rows: 0,
    cols: 0,
    map: null,
    draw: function(mapOrigin, litCells) {
	for (row = 0; row < this.rows; row++) {
	    for (col = 0; col < this.cols; col++) {
		this.map.get(row, col).draw(mapOrigin, row, col, 0)
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
    row: 0,
    col: 0,
    map: null,
    light: null,
    objList: [],
    player: player,
    eventLogic: function(worldEvent) {
	console.log(worldEvent) // TO BE REPLACED BY EACH WORLD
    },
    draw: function () {
	this.map.draw([this.row, this.col], [])
	this.player.draw([this.row, this.col], this.player.row, this.player.col, 0)
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
    var rows = 30
    var cols = 30
    let map = Object.create(mapPrototype)
    map.rows = 30
    map.cols = 30
    map.map = new Array2d(map.rows, map.cols)
    for (row = 0; row < map.map.rows; row++) {
	for (col = 0; col < map.map.cols; col++) {
	    var newCell = emptyCell()
	    map.map.add(row, col, newCell)
	}
    }
    console.log(map.map)
    return map
}
	    
 

function overWorld(progress, frameShift) {
    console.log(frameShift)
    let overWorld = Object.create(worldPrototype, {
	map: {value: overWorldMap(progress)}	
    })
    overWorld.eventLogic = function(worldEvent) {
	console.log("in overworld event Logic")
	if (dirMap.has(worldEvent)) {
	    if(canFrameShift(overWorld.map, overWorld.row, overWorld.col, dirMap.get(worldEvent))) {
		console.log("can frame shift")
		var movingObjects = overWorld.objList.filter(obj => obj.isMoving)
		frameShift(overWorld.map, overWorld.row, overWorld.col, dirMap.get(worldEvent),
			       movingObjects, overWorld.checkPortals)
	    }
	}
	else if (worldEvent === PRIMARY) {
	    overWorld.map.inspect(incRow(player.row, player.dir), incCol(player.col, player.dir))
	    overWorld.draw()
	}
	else if (worldEvent === SECONDARY) {
	    //no objects to push here
	}
    }	
    overWorld.map.addObject(0, 1, overWorld.player)
    return overWorld
}

function frameShift(map, row, col, dir, movingObjects, callback) {
    console.log("frame shift!")
}

var universe = {
    questProgress: new QuestProgress(),
    questTriggers: [],
    overlays: [],
    activeWorld: overWorld(this.questProgress, frameShift),
    startGame:  function() {
	registerEventListeners()
	keyData.logic = this.activeWorld.eventLogic
	this.activeWorld.draw()
    },
    changeEventLogic: function(logic) {
	keyData.logic = logic
    },
    addOverlay: function(overlay) {
	this.overlays.push(overlay)
    },
    removeOverlay: function(overlay) {
	this.overlays.splice(this.overlays.indexOf(overlay), 1)
    }
    
}

universe.startGame()
