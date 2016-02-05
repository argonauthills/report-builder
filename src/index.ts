/// <reference path="../typings/requirejs/require.d.ts" />
declare var process: any;

import Promise = require('bluebird')
import settings = require('./settings')
import output = require('./output/output')
import parse = require('./parse/parse')
import transform = require('./transform/transform')
import types = require('./types')
var parseArgs = require('minimist')

function random(num:number) {
    return Math.random()*num
}

function main() {
    var args = parseArgs(process.argv.slice(2))

    if (!args.config || !args.dest || !args.data) {
        console.log("Usage: node src/index.js --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf")
        return
    }

    return Promise.resolve()
    .then(() => Promise.all([
        parse.fromCsv(args.data),
        parse.fromJson(args.config)
    ]))
    .spread(( rawData: types.RawDatum[], config:types.ReportConfig) => {
        var report = transform.rawToReport(rawData, config)
        return output.runOutput(report, settings.TEMPLATE_PATH, args.dest, settings.TEMP_DIRECTORY)
    })
    .then(() => console.log("DONE!"))
    .catch((err) => console.log("Err", err, err.stack))
}

main()

