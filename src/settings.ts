declare var __dirname:string;
var path = require('path');

export var TEMP_DIRECTORY = path.join(__dirname, '../temp')
console.log("TEMP_DIRECTORY", TEMP_DIRECTORY)