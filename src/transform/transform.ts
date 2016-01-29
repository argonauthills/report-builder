import types = require('../types')
import _ = require('lodash')

export function rawToReport(data:types.RawDatum[], config:types.ReportConfig):types.Report {
    var transformedSections:types.ReportSection[] = config.sections.map(function(configSection) {
        return transformSection(data, configSection)
    })

    return {
        header: config.header,
        description: config.description,
        sections: transformedSections
    }
}


function transformSection(data:types.RawDatum[], configSection:types.ReportConfigSection):types.ReportSection {
    var questions = configSection.questions.map((configQuestion)=>{
        return transformQuestion(data, configQuestion)
    })
    var header = sectionHeader(questions, configSection)
    return {
        header: header,
        questions: questions
    }
}

function sectionHeader(questions:types.ReportQuestion[], configSection:types.ReportConfigSection):types.ReportQuestion {
    return {
        description: configSection.header,
        orgScore: mean(_.map<types.ReportQuestion, number>(questions, 'orgScore')),
        industryNorm: mean(_.map<types.ReportQuestion, number>(questions, 'industryNorm')),
        globalNorm: mean(_.map<types.ReportQuestion, number>(questions, 'globalNorm')),
        scale: _.first<number>(_.map<types.ReportQuestion, number>(questions, 'scale')) || 1
    }
}

function transformQuestion(data:types.RawDatum[], configQuestion:types.ReportConfigQuestion):types.ReportQuestion {
    var points = dataPoints(data, configQuestion.id)
    return {
        description: configQuestion.description,
        orgScore: mean(points),
        industryNorm: configQuestion.industryNorm,
        globalNorm: configQuestion.globalNorm,
        scale: configQuestion.scale
    }
}

function dataPoints(data:types.RawDatum[], questionId:string):number[] {
    return _.reject<number>(data.map(function(datum) {
        return datum[questionId]
    }), function(point) {
        return point == null  // we omit nully data
    })
}

function sum(xs:number[]):number {
    return xs.reduce(function(acc, x) {
        return acc + x
    }, 0)
}

function mean(xs:number[]):number {
    if (xs.length == 0) return 0
    return sum(xs) / xs.length
}