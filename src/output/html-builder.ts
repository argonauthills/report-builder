import Promise = require('bluebird')
import swig = require('swig')
import id = require('../lib/id')
import types = require('../types')
var path = require('path')
var fs = require('fs')

var renderFile = Promise.promisify<any, string, swig.SwigOptions>(swig.renderFile)
var writeFile = Promise.promisify<any, string, string>(fs.writeFile)

export function generateHtml(data:types.Report, templatePath:string, tempDir:string):Promise<string> {
    var tempPath = randomHtmlName(tempDir)
    var options = data
    return renderFile(templatePath, options)
    .then((renderedHtml:string) => {
        return writeFile(tempPath, renderedHtml)
    })
    .then(() => {
        console.log("temp path", tempPath)
        return tempPath
    })

}

export function randomHtmlName(dir:string):string {
    return path.join(dir, id.generate(10)+'.html')
}