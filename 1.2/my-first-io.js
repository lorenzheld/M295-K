const fs = require('fs')
const path = process.argv[2]

const lines = (fs.readFileSync(path).toString().split("\n").length) -1

console.log(lines)