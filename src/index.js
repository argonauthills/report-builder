/// <reference path="../typings/requirejs/require.d.ts" />
var settings = require('./settings');
var output = require('./output/output');
var parseArgs = require('minimist');
function main() {
    var args = parseArgs(process.argv.slice(2));
    console.log("args", args);
    if (!args.config || !args.dest || !args.data) {
        console.log("Usage: node src/index.js --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf");
        return;
    }
    output.runOutput(args.data, settings.TEMPLATE_PATH, args.dest, settings.TEMP_DIRECTORY)
        .then(function () { return console.log("converted!"); });
}
main();
