var canvas = document.getElementById("canvas")
if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext("2d")
}

canvas.height = window.innderHeight
canvas.width = window.innerWidth

cx.fillStyle = "rgb(255,0,100)"
cx.fillRect(0, 0, canvas.width, canvas.height)

console.log(canvas.width)

const SOLVED = 1;
const UNSOLVED = 2;
const PRIMARY = 73 // "i"
const SECONDARY = 71 // "g"


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
function QuestProgress() {
    this.levelsCompleted = {"parthenon": false,
			     "basilica": false,
			     "edu": false,
			     "christ": false
			    }
}

function canFrameShift(map, row, col, dir) {
    if (!map.hasObjectAt(row, col)) return map.isObstacleAt(row, col)
    else {
	if (map.getObjectAt(row, col).isMovable) {
	    while(map.hasObjectAt(row, col)) {
		row = incr(dir)
		col = incr(dir)
	    }
	    return map.isObstacleAt(row, col)
	}
	else return false
    }
}

function OverWorld(progress, frameShift, removeOverlay, addOverlay, changeLogic) {
    this.row = 0
    this.col = 0
    this.map = new OverWorldMap(progress) 
    this.light = new FullLight()
    this.objList = [],
    this.player = new Player(),
    this.eventLogic = function(event) {
	if (isArrow(event.keyCode)) {
	    if(canFrameShift(this.map, this.row, this.col, dirFromEvent(event))) {
		var movingObjects = this.objList.filter(obj => obj.isMoving)
		frameShift(this.map, this.row, this.col, dirFromEvent(event), movingObjects, this.checkPortals)
	    }
	}
	else if (event.keyCode == PRIMARY) {
	    this.map.inspect(incr(player.row), incr(player.col))
	    this.draw()
	}
	else if (event.keyCode == SECONDARY) {
	    //no objects to push here
	}
    },
    this.draw = function() {
	this.map.draw(x, y, this.light.shine(x, y))
    },
    this.checkPortals = function(row, col) {
	this.draw() // for basic testing
    },
}

var universe = {
    eventLoop: new KeyStackEventLoop(),
    questProgress: new QuestProgress(),
    questTriggers: [],
    overlays: [],
    activeWorld: new OverWorld(this.questProgress.levelsCompleted, this.frameShift, this.addOverLay,
			       this.removeOverLay, this.changeEventLogic),
    frameShift: function(map, row, col, dir, movingObjects, callback) {
	moveingObjects.forEach(function(obj) {
	    obj.row = incr(row, dir)
	    obj.col = incr(col, dir)
	})
	this.activeWorld.row = incr(row, dir)
	this.activeWorld.col = incr(col, dir)
	callback()
	//no animation, just change, for testing
    },
    startGame: function() {
	this.eventLoop.register()
	this.eventLoop.newLogic(this.activeWorld.eventLogic)
	this.activeWorld.draw()
    },
    changeEventLogic: function(logic) {
	this.eventLoop.newLogic(logic)
    },
    addOverlay: function(overlay) {
	this.overlays.push(overlay)
    },
    removeOverlay: function(overlay) {
	this.overlays.splice(this.overlays.indexOf(overlay), 1)
    },
    
}

universe.startGame()


