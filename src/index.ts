/// <reference path="../typings/requirejs/require.d.ts" />
declare var process: any;

import Promise = require('bluebird')
import settings = require('./settings')
import output = require('./output/output')
import parse = require('./parse/parse')
import transform = require('./transform/transform')
import types = require('./types')
import _ = require('lodash')
var parseArgs = require('minimist')

function random(num:number) {
    return Math.random()*num
}

function main() {
    var args = parseArgs(process.argv.slice(2))

    if (!args.config || !args.dest || !args.data || !args.globalNorms || !args.industryNorms || !args.industryCode) {
        console.log("Usage: node src/index.js --globalNorms /path/to/globalNorms.csv --industryNorms /path/to/industry-norms.csv --config /path/to/config.json --data /path/to/data.csv --industryCode 34 --dest /path/to/destination.pdf")
        return
    }

    return Promise.resolve()
    .then(() => Promise.all([
        parse.fromCsv(args.data),
        parse.fromJson(args.config),
        parse.fromCsv(args.globalNorms),
        parse.fromCsv(args.industryNorms)
    ]))
    .spread(( rawData: types.RawDatum[], config:types.ReportConfig, rawGlobal:types.RawDatum[], rawIndustries:types.RawDatum[]) => {
        var globalNorms = _.first(rawGlobal)  //there's only one
        // console.log("industries", _.first(rawIndustries))
        var industryNorms = _.find(rawIndustries, function(i) {
            var industryColumnName = "NAICS2.n"
            // console.log("industry", i[industryColumnName], typeof i[industryColumnName])
            return i[industryColumnName] == args.industryCode
        })
        if (rawData.length < 5) return Promise.resolve("Too few data points for report").then((rs) => console.log(rs))
        if (!globalNorms) throw new Error("couldn't find global norms!")
        if (!industryNorms) throw new Error("couldn't find industry norms!")
        var report = transform.rawToReport(rawData, config, globalNorms, industryNorms)
        return output.runOutput(report, settings.TEMPLATE_PATH, args.dest, settings.TEMP_DIRECTORY)
    })
    .then(() => console.log("DONE!"))
    .catch((err) => console.log("Err", err, err.stack))
}

main()

