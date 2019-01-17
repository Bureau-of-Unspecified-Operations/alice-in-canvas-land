const fs = require("fs")

const paths = [
    {
	read: "map_csvs/greece.csv",
	write: "map_jsons/greece.json"
    },
    {
	read: "map_csvs/overworld.csv",
	write: "map_jsons/overworld.json"
    },
    {
	read: "map_csvs/rome.csv",
	write: "map_jsons/rome.json"
    },
    {
	read: "map_csvs/france.csv",
	write: "map_jsons/france.json"
    },
    {
	read: "map_csvs/egypt.csv",
	write: "map_jsons/egypt.json"
    },
    {
	read: "map_csvs/end.csv",
	write: "map_jsons/end.json"
    }
]


function csvToGrid(csv) {
    var grid = []
    let rows = csv.split(String.fromCharCode(10))
    rows = rows.map(function(str) {
	str = str.replace("\r", "")
	row = str.split(",")
	grid.push(row)
    })
    return grid
}

function convertAll() {
    paths.forEach(function(path) {
	let csv = fs.readFileSync(path.read, "utf8")
	fs.writeFileSync(path.write, JSON.stringify(csvToGrid(csv)))
    })
}

convertAll()
    
