/// <reference path="../typings/requirejs/require.d.ts" />
declare var process: any;

import settings = require('./settings')
import output = require('./output/output')
import types = require('./types')
var parseArgs = require('minimist')

function random(num:number) {
    return Math.random()*num
}

var dummyReportData:types.Report = {
    header: "the main header",
    description: "the description",
    sections: [
        {
            header: { question: "section 1 heading", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale:5 },
            questions: [
                { question: "q1", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q2", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q3", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q4", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q5", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q6", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 }
            ]
        },
        {
            header: { question: "section 2 heading", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale:5 },
            questions: [
                { question: "q1", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q2", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q3", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q4", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q5", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 },
                { question: "q6", orgScore: random(5), industryNorm: random(5), globalNorm: random(5), scale: 5 }
            ]
        }
    ]
}

function main() {
    var args = parseArgs(process.argv.slice(2))
    console.log("args", args)

    if (!args.config || !args.dest || !args.data) {
        console.log("Usage: node src/index.js --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf")
        return
    }
    output.runOutput(dummyReportData, settings.TEMPLATE_PATH, args.dest, settings.TEMP_DIRECTORY)
    .then(()=> console.log("converted!"))
}

main()

