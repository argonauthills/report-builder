declare var __dirname: string;

import Promise = require('bluebird')
import types = require('../types')
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var execFile = Promise.promisify<any, string, string[]>(childProcess.execFile)

export function convertHtmlToPdf(htmlPath, destPath, firstPageNumber, numbersPagesFrom, footers:types.ReportFooters):Promise<any> {

    if (!footers) footers = {
        firstFooter: "",
        firstFooterStart: 0,
        secondFooter: "",
        secondFooterStart: 0
    }

    var childArgs = [
        path.join(__dirname, 'rasterize.js'),  // rasterize script
        htmlPath,
        destPath,
        'letter',
        firstPageNumber,
        numbersPagesFrom,
        footers.firstFooter,  // very gross
        footers.firstFooterStart,
        footers.secondFooter,
        footers.secondFooterStart
    ]

    return execFile(binPath, childArgs)
}

