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
    return {
        description: configSubsection.header,
        questions: questions,
        orgScore: mean(questions.map((q) => q.orgScore)),
        industryNorm: mean(questions.map((q)=>q.industryNorm)),
        globalNorm: mean(questions.map((q)=>q.globalNorm)),
        scale: configSubsection.scale || 1,
        scaleInterval: configSubsection.scaleInterval || 1
    }
}

function transformQuestion(data:types.RawDatum[], configQuestion:types.ReportConfigQuestion, globalNorms:types.RawDatum, industryNorms:types.RawDatum):types.ReportQuestion {
    var points = dataPoints(data, configQuestion.id, configQuestion.includeNulls)
    var industryNorm = getNorm(industryNorms, configQuestion.id)
    var globalNorm = getNorm(globalNorms, configQuestion.id)
    return {
        description: configQuestion.description,
        orgScore: mean(points),
        industryNorm: industryNorm,
        globalNorm: globalNorm,
    }
}

function getNorm(norms: types.RawDatum, questionId:string):number {
    if (!_.has(norms, questionId)) throw new Error("We might be missing data; can't get norm for "+questionId)
    return norms[questionId]
}

function dataPoints(data:types.RawDatum[], questionId:string, includeNulls:boolean):number[] {
    var points = data.map(function(datum) {
        return datum[questionId]
    })
    if (includeNulls) points = points.map((p) => { return p || 0 })
    return _.reject<number>(points, (p) => { return p == null })  // we omit nully data
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