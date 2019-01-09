const fs = require("fs")

const GREECE_READ = "map_csvs/greece.csv"
const GREECE_WRITE = "map_jsons/greece.json"

const greece_csv = fs.readFileSync(GREECE_READ, "utf8")



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

console.log(csvToGrid(greece_csv))

fs.writeFileSync(GREECE_WRITE, JSON.stringify(csvToGrid(greece_csv)))
