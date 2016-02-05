import types = require('../types')
import _ = require('lodash')

export function rawToReport(data:types.RawDatum[], config:types.ReportConfig, globalNorms:types.RawDatum, industryNorms:types.RawDatum):types.Report {
    var transformedSections:types.ReportSection[] = config.sections.map(function(configSection) {
        return transformSection(data, configSection, globalNorms, industryNorms)
    })

    return {
        sections: transformedSections
    }
}

function transformSection(data: types.RawDatum[], configSection: types.ReportConfigSection, globalNorms: types.RawDatum, industryNorms: types.RawDatum): types.ReportSection {
    var subsections = configSection.subsections.map((configSubsection) => {
        return transformSubsection(data, configSubsection, globalNorms, industryNorms)
    })
    return {
        header: configSection.header,
        description: configSection.description,
        subsections: subsections
    }
}

function transformSubsection(data:types.RawDatum[], configSubsection:types.ReportConfigSubsection, globalNorms:types.RawDatum, industryNorms:types.RawDatum):types.ReportSubsection {
    var questions = configSubsection.questions.map((configQuestion)=>{
        return transformQuestion(data, configQuestion, globalNorms, industryNorms)
    })
    var header = sectionHeader(questions, configSubsection)
    var scale = _.first(questions).scale  // we get the section scale from the first question (they should all match anyway)
    if (!scale) throw new Error("Cannot determine scale for section " + header.description)
    return {
        header: header,
        questions: questions,
        orgScore: mean(questions.map((q) => q.orgScore)),
        industryNorm: mean(questions.map((q)=>q.industryNorm)),
        globalNorm: mean(questions.map((q)=>q.globalNorm)),
        scale: scale
    }
}

function sectionHeader(questions:types.ReportQuestion[], configSection:types.ReportConfigSubsection):types.ReportQuestion {
    return {
        description: configSection.header,
        orgScore: mean(_.map<types.ReportQuestion, number>(questions, 'orgScore')),
        industryNorm: mean(_.map<types.ReportQuestion, number>(questions, 'industryNorm')),
        globalNorm: mean(_.map<types.ReportQuestion, number>(questions, 'globalNorm')),
        scale: _.first<number>(_.map<types.ReportQuestion, number>(questions, 'scale')) || 1
    }
}

function transformQuestion(data:types.RawDatum[], configQuestion:types.ReportConfigQuestion, globalNorms:types.RawDatum, industryNorms:types.RawDatum):types.ReportQuestion {
    var points = dataPoints(data, configQuestion.id)
    var industryNorm = getNorm(industryNorms, configQuestion.id)
    var globalNorm = getNorm(globalNorms, configQuestion.id)
    return {
        description: configQuestion.description,
        orgScore: mean(points),
        industryNorm: industryNorm,
        globalNorm: globalNorm,
        scale: configQuestion.scale
    }
}

function getNorm(norms: types.RawDatum, questionId:string):number {
    if (!_.has(norms, questionId)) throw new Error("We might be missing data; can't get norm for "+questionId)
    return norms[questionId]
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