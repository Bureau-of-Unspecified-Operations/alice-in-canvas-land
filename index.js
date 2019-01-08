var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext("2d")
}

canvas.height = Math.floor(window.innerHeight / 4 * 3)
canvas.width = Math.floor(window.innerWidth / 4 * 3)



const BACKGROUND_COLOR = "rgb(0,0,0)"
const TEXT_BACKGROUND_COLOR = "rgb(222,184,135)"
const TEXT_FONT = "20px Arial"
const TEXT_COLOR = "rgb(0,0,0)"

const TEST_STRING = "hello, my name is joe, I want to tell you all about what I have been up to lately. I have to make way more filler text than I expected which is why none of this means anything unless you subscribe to iceberg theory where even if I'm not trying to inject any meaning, tunconscious event in my mind influence my writing in a such a way as to make my opinion about my work irrelevant"

const CELL_SIZE = 40
const SHIFT_TIME = 300 // in millis
const SCREEN = {
    width: 400,
    height: 400
}
const CENTER_ROW = Math.floor(Math.floor(SCREEN.height / CELL_SIZE) / 2)
const CENTER_COL= Math.floor(Math.floor(SCREEN.width / CELL_SIZE) / 2)

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
const TEXT_FINISHED = -1

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
	console.log("key secondary pressed")
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


//##################################################3



/*function QuestProgress() {
    this.levelsCompleted = {"parthenon": false,
			     "basilica": false,
			     "edu": false,
			     "christ": false
			    }
			    }*/

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

function rock() {
    var rock = Object.create(drawable, {
    row: {value: 4,
	  writable: true
	 },
    col: {value: 5,
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
	return [incRow(rock.row, dir), incCol(rock.col, dir)]
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



// ignores possibility of pushingn an object that touches a movable obj, cuz i don't plan on this happening
function canFrameShift(map, row, col, dir) {
    if (row < 0 || col < 0 || row >= map.rows || col >= map.cols) return false
    if (!map.hasObstacleAt(row, col)) {
	if (map.hasObjectTouching(row, col)) {
	    var obj = map.getObjectTouching(row, col)
	    if (obj.isMoving === false) return false
	    var frontier = obj.getFrontier(dir)
	    var v = true
	    frontier.forEach(function(r, c) {
		if (map.hasObstacleAt(r, c) || map.hasObjectTouching(r, c)) v = false
	    })
	    return v
	}
	return true //no obstacle, no obj
    }
    
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


function frameShift(map, mapOrigin, dir, movingObjects, overWorld) {
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
	    overWorld.row = incRow(overWorld.row, dir)
	    overWorld.col = incCol(overWorld.col, dir)
	    movingObjects.forEach(function(obj) {
		obj.row = incRow(obj.row, dir)
		obj.col = incCol(obj.col, dir)
	    })
	    //overWorld.player.inc(dir)
	    overWorld.draw()
	    keyData.logic = prevLogic
	  //  overWorld.checkPortals()
	    if (keyData.keyStack.length !== 0) {
		overWorld.eventLogic(keyData.keyStack[keyData.keyStack.length - 1])
	    }
	}
    }
    window.requestAnimationFrame(animate)
    
}


//#####################################
// WORLD AND MAP PROTOTYPES (SORTA)
//#####################################

var mapPrototype = {
    rows: 0,
    cols: 0,
    map: null,
    objList: [],
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
	console.log(`r,c = ${row},${col}`)
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
    map: null,
    light: null,
    player: player,
    centerOrigin: function() {
	console.log(this)
	this.row = this.map.playerStartRow - CENTER_ROW
	this.col = this.map.playerStartCol - CENTER_COL
	player.row = this.map.playerStartRow
	player.col = this.map.playerStartCol
	console.log(`r,c=${this.row},${this.col}, screen rc=${SCREEN.centerRow},${SCREEN.centerCol}`)
    },
    inspect: function() {
	
	
    },
    draw: function () {
	clearScreen()
//	console.log("orig [" + this.row + ", " + this.col + "]")
	this.map.draw([this.row, this.col], 0, [0,0], [])
    },
    checkPortals: function(row, col) {
	this.map.portals.forEach(function(portal) {
	    if (portal.contains(row, col)) {
		
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
	   /* console.log("in inspect")
	    console.log(this)
	    console.log(self)*/
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
	else if (worldEvent === GRAB) {
	    var isGrabbed = !keyData.isKeyNew.get(GRAB) //ugly, backwards cuz of earlier keystack plan
	    console.log(player.getAdjCells())
	    var adj = player.getAdjCells()
	    this.map.objList.forEach(function(obj) {
		adj.forEach(function(coord) {
		    if (obj.contains(coord[0], coord[1])) obj.isMoving = isGrabbed
		})
	    })
	}
    }
}

//###########################################################
// ACTUAL WORLDS AND MAPS
//##########################################################


function parthenonMap(progress) {
    let map = Object.create(mapPrototype)
    map.rows = 5
    map.cols = 5
    map.playerStartRow = 0
    map.playerStartCol = 0
    map.map = new Array2d(map.rows, map.cols)
    for (row = 0; row < map.rows; row ++) {
	for (col = 0; col < map.cols; col ++) {
	    var newCell = emptyCell(null)
	    map.map.add(row, col, newCell)
	}
    }

    return map
}

function ancientGreece(progress) {
    let greece = Object.create(worldPrototype, {
	map: {value: parthenonMap(progress)}
    })
    greece.centerOrigin()
    greece.map.objList.push(player)
    greece.eventLogic = function(worldEvent) {
	greece.eLogic(worldEvent)
    }

    return greece
    
}

function overWorldMap(progress) {
    let map = Object.create(mapPrototype)
    map.rows = 10
    map.cols = 10
    map.playerStartRow = 0
    map.playerStartCol = 0
    map.map = new Array2d(map.rows, map.cols)
    for (row = 0; row < map.map.rows; row++) {
	for (col = 0; col < map.map.cols; col++) {
	    var newCell = emptyCell(null)
	    map.map.add(row, col, newCell)
	}
    }
    map.map.get(4,5).overlay = textOverlay(TEST_STRING)
  //  console.log(map.map)
    return map
}
	    
 

function overWorld(progress) {
    let overWorld = Object.create(worldPrototype, {
	map: {value: overWorldMap(progress)}	
    })
    overWorld.centerOrigin()
    overWorld.map.objList.push(player)
    overWorld.map.objList.push(rock())
    overWorld.overlayCallback = function() {
	overWorld.draw()
    }
    overWorld.eventLogic = function(worldEvent) {
	overWorld.eLogic(worldEvent)
    }
   /* overWorld.eventLogic = function(worldEvent) {
	if (dirMap.has(worldEvent)) {
	    let dir = dirMap.get(worldEvent)
	    let movingObjects = overWorld.map.objList.filter(obj => obj.isMoving)
	    if (canFrameShift(overWorld.map, incRow(player.row, dir), incCol(player.col, dir), dir)) {
		frameShift(overWorld.map, [overWorld.row, overWorld.col], dir, movingObjects, overWorld)
	    }	    
	}
	else if (worldEvent === INSPECT) {
	    let adj = player.getAdjCells()
	    adj.forEach(function(coord) {
		let row = coord[0]
		let col = coord[1]
		let cell = overWorld.map.map.get(row, col)
		console.log(`r,c = ${row},${col}`)
		console.log(cell)
		if (cell.overlay !== null) {
		    let overlay =  cell.overlay
		    overlay.registerLogic(overWorld.eventLogic)
		    overlay.registerCallback(overWorld.overlayCallback)
		    overlay.step()
		}
	    })	   // overWorld.draw()
	}
	else if (worldEvent === GRAB) {
	    var isGrabbed = !keyData.isKeyNew.get(GRAB) //ugly, backwards cuz of earlier keystack plan
	    console.log(player.getAdjCells())
	    var adj = player.getAdjCells()
	    overWorld.map.objList.forEach(function(obj) {
		adj.forEach(function(coord) {
		    if (obj.contains(coord[0], coord[1])) obj.isMoving = isGrabbed
		})
	    })
	}
    }	*/
   // overWorld.map.addObject(0, 1, overWorld.player)
    return overWorld
}



var universe = {
   // questProgress: new QuestProgress(),
   // questTriggers: [],
   // overlays: [],
    activeWorld: ancientGreece(this.questProgress),
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


/*clearCanvas()
clearScreen()
let pnt = wrappedTextbox(TEST_STRING)
console.log(TEST_STRING.slice(pnt, TEST_STRING.length))
*/

