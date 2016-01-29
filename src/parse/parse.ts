import Promise = require('bluebird')
import types = require('../types')
var fs = require('fs')
// var babyParse = require('babyparse')
var readFile = Promise.promisify<string, string, string>(fs.readFile)

// export function fromCsv(pathToCsv:string):Promise<types.RawData> {
//     return readFile(pathToCsv)
//     .then((csv:string) => {
//         return babyParse.parse(csv)
//     })
// }

var Converter = require("csvtojson").Converter;
var converter = new Converter({ignoreEmpty:true});
// var parse = Promise.promisify<string, string>(converter.fromFile)  // promisification seems to break the converter

export function fromCsv(pathToCsv:string):Promise<types.RawDatum[]> {
    return new Promise<types.RawDatum[]>(function(resolve, reject) {
        converter.fromFile(pathToCsv, function(err, result:types.RawDatum[]) {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

export function fromJson(pathToJson:string):Promise<types.ReportConfig> {
    return readFile(pathToJson, 'utf8')
    .then((data:string) => JSON.parse(data))
}
