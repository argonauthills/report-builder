/// <reference path="../typings/requirejs/require.d.ts" />
declare var process: any;

import Promise = require('bluebird')
import settings = require('./settings')
import output = require('./output/output')
import parse = require('./parse/parse')
import transform = require('./transform/transform')
import types = require('./types')
import _ = require('lodash')
var DataURI = require('datauri').promise;
var parseArgs = require('minimist')

function random(num:number) {
    return Math.random()*num
}

function main() {
    var args = parseArgs(process.argv.slice(2))

    if (!args.config || !args.dest || !args.data || !args.globalNorms || !args.industryNorms || !args.industryCodes || !args.companyId) {
        console.log("Usage: node src/index.js --globalNorms /path/to/globalNorms.csv --industryNorms /path/to/industry-norms.csv --config /path/to/config.json --data /path/to/data.csv --industryCodes /path/to/industry-codes.csv --companyId 2016 --dest /path/to/destination.pdf")
        return
    }

    return Promise.resolve()
    .then(() => Promise.all([
        parse.fromCsv(args.data),
        parse.fromJson(args.config),
        parse.fromCsv(args.globalNorms),
        parse.fromCsv(args.industryNorms),
        parse.fromCsv(args.industryCodes)
    ]))
    .spread(( rawData: types.RawDatum[], config:types.ReportConfig, rawGlobal:types.RawDatum[], rawIndustries:types.RawDatum[], rawIndustryCodes:types.RawDatum[]) => {
        if (!!config.minDataPoints && rawData.length < config.minDataPoints) return Promise.resolve("Too few data points for report. Had "+rawData.length+" point(s).").then((rs) => console.log(rs))
        var companyId = args.companyId
        var orgInfo = _.find(rawIndustryCodes, (row) => {
            // consolee.log(row['ProjectID'], typeof row['ProjectID'], companyId, typeof companyId)
            return row['ProjectID'] == companyId
        })
        if (!orgInfo) throw new Error("couldn't find orgInfo for ProjectID "+ companyId)
        var industryCode = orgInfo['IndustryCode']
        var companyName = orgInfo['OrgName']
        var industryName = orgInfo['IndustryType']

        var globalNorms = _.first(rawGlobal)  //there's only one
        var industryNorms = _.find(rawIndustries, function(i) {
            var industryColumnName = "NAICS2.n"
            // console.log("industry", i[industryColumnName], typeof i[industryColumnName])
            return i[industryColumnName] == industryCode
        })
        if (!companyId) throw new Error("missing company id")
        if (!globalNorms) throw new Error("couldn't find global norms!")
        if (!industryNorms) throw new Error("couldn't find industry norms!")
        if (!industryCode) throw new Error("couldn't find industry code!")

        return Promise.all([
            (config.mainImage) ? DataURI(config.mainImage) : Promise.resolve(null),
            (config.footerImage) ? DataURI(config.footerImage) : Promise.resolve(null)
        ])
        .spread(function(mainUri?:string, footerUri?:string) {
            var report = transform.rawToReport(rawData, config, globalNorms, industryNorms, companyName, industryName, mainUri, footerUri)
            var firstPageNumber = config.firstPageNumber
            var numberPagesFrom = config.numberPagesFrom
            if (firstPageNumber == null) throw new Error("firstPageNumber required in report config")
            if (numberPagesFrom == null) throw new Error("numberPagesFrom required in report config")
            return output.runOutput(report, settings.TEMPLATE_PATH, args.dest, settings.TEMP_DIRECTORY, firstPageNumber, numberPagesFrom)
        })
        .then(() => null)
    })
    .then(() => console.log("DONE!\n"))
    .catch((err) => console.log("Err", err, err.stack))
}

main()

