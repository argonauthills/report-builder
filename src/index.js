/// <reference path="../typings/requirejs/require.d.ts" />
var parseArgs = require('minimist');
function main() {
    var args = parseArgs(process.argv.slice(2));
    console.log("args", args);
    if (!args.config || !args.dest || !args.data) {
        console.log("usage: npm start --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf");
        return;
    }
    console.log("success!");
}
main();
