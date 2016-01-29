declare var __dirname:string;
var path = require('path');

export var TEMP_DIRECTORY = path.join(__dirname, '../temp')
export var TEMPLATE_DIRECTORY = path.join(__dirname, '../src/template')
export var TEMPLATE_PATH = path.join(TEMPLATE_DIRECTORY, 'report.html')
