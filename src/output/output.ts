import Promise = require('bluebird')
import pdfConverter = require('./pdf-converter')
import htmlBuilder = require('./html-builder')
import types = require('../types')
var fs = require('fs')
var unlink = Promise.promisify<any, string>(fs.unlink)

export function runOutput(data:types.Report, templatePath:string, destPath:string, tempDir:string):Promise<any> {
    return Promise.resolve(null)
    .then(() => htmlBuilder.generateHtml(data, templatePath, tempDir))
    .then((tempHtmlPath: string) => {
        return pdfConverter.convertHtmlToPdf(tempHtmlPath, destPath)
        // .then(() => cleanup(tempHtmlPath))
    })
}

export function cleanUpFile(path:string):Promise<any> {
    return unlink(path)
}