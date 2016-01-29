/// <reference path="../typings/requirejs/require.d.ts" />
var output = require('./output/output');
var parseArgs = require('minimist');
function main() {
    var args = parseArgs(process.argv.slice(2));
    console.log("args", args);
    if (!args.config || !args.dest || !args.data) {
        console.log("Usage: node src/index.js --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf");
        return;
    }
    output.convertHtmlToPdf(args.data, args.dest)
        .then(function () { return console.log("converted!"); });
    console.log("success!");
}
main();
