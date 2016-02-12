import Promise = require('bluebird')
import swig = require('swig')
import id = require('../lib/id')
import types = require('../types')
import _ = require('lodash')
var path = require('path')
var fs = require('fs')

var renderFile = Promise.promisify<any, string, swig.SwigOptions>(swig.renderFile)
var writeFile = Promise.promisify<any, string, string>(fs.writeFile)

interface TemplateData {
    report: types.Report;
    tickMarks: Function;
    tickMarkLabels: Function;
    htmlFriendly: Function;
}

interface TickMark {
    label: string;
    percentOfScale: number;
}

export function generateHtml(data:types.Report, templatePath:string, tempDir:string):Promise<string> {
    var tempPath = randomHtmlName(tempDir)
    var options = {
        report: data,
        tickMarks: tickMarks,
        tickMarkLabels: tickMarkLabels,
        htmlFriendly: htmlFriendly,
        indexOf: indexOf
    }
    return renderFile(templatePath, options)
    .then((renderedHtml:string) => {
        return writeFile(tempPath, renderedHtml)
    })
    .then(() => {
        // console.log("temp path", tempPath)
        return tempPath
    })

}

export function randomHtmlName(dir:string):string {
    return path.join(dir, id.generate(10)+'.html')
}


function indexOf(items, item) {
    return _.indexOf(items, item) + 1
}

function tickMarkLabels(scale:number, interval:number=1):TickMark[] {
    return _.range(0, scale+1 /* we want the endpoints too */, interval).map(function(mark:number) {
        return {
            label: mark.toString(),
            percentOfScale: 100 * mark / scale
        }
    })
}

function tickMarks(scale: number, interval: number = 1): TickMark[] {
    return _.range(interval, scale /*we don't want tickMarks at endpoints*/, interval).map(function(mark: number) {
        return {
            label: mark.toString(),
            percentOfScale: 100 * mark / scale
        }
    })
}

function htmlFriendly(str:string):string {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/’/g, "&#39;").replace(/–/g, '&#8212;');
}