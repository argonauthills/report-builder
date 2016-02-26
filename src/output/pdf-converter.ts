declare var __dirname: string;

import Promise = require('bluebird')
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var execFile = Promise.promisify<any, string, string[]>(childProcess.execFile)

export function convertHtmlToPdf(htmlPath, destPath, firstPageNumber, numbersPagesFrom):Promise<any> {
    var childArgs = [
        path.join(__dirname, 'rasterize.js'),  // rasterize script
        htmlPath,
        destPath,
        'letter',
        firstPageNumber,
        numbersPagesFrom
    ]

    return execFile(binPath, childArgs)
}

