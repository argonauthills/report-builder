import Promise = require('bluebird')
import types = require('../types')
// var fs = require('fs')
// var babyParse = require('babyparse')
// var readFile = Promise.promisify<string, string>(fs.readFile)

// export function fromCsv(pathToCsv:string):Promise<types.RawData> {
//     return readFile(pathToCsv)
//     .then((csv:string) => {
//         return babyParse.parse(csv)
//     })
// }

var Converter = require("csvtojson").Converter;
var converter = new Converter({ignoreEmpty:true});
// var parse = Promise.promisify<string, string>(converter.fromFile)  // promisification seems to break the converter

export function fromCsv(pathToCsv:string):Promise<types.RawData> {
    return new Promise(function(resolve, reject) {
        converter.fromFile(pathToCsv, function(err, result) {
            if (err) reject(err)
            else resolve(result)
        })
    })

}
