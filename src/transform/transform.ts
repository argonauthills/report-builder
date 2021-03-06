import types = require('../types')
import _ = require('lodash')

export function rawToReport(data:types.RawDatum[], config:types.ReportConfig, globalNorms:types.RawDatum, industryNorms:types.RawDatum, companyName:string, industryName:string, mainUri:string, footerUri:string):types.Report {
    var transformedSections:types.ReportSection[] = config.sections.map(function(configSection) {
        return transformSection(data, configSection, globalNorms, industryNorms)
    })
    return {
        numberPagesFrom: config.numberPagesFrom,
        firstPageNumber: config.firstPageNumber,
        projectName: config.projectName,
        mainUri: mainUri,
        footerUri: footerUri,
        title: config.title,
        companyName: companyName,
        industryName: industryName,
        sections: transformedSections,
        excludeTableOfContents: config.excludeTableOfContents,
        excludeCoverPage: config.excludeCoverPage,
        excludeSectionNumbers: config.excludeSectionNumbers,
        footers: config.footers,
        numResponses: data.length
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
        title: configSubsection.header,
        description: configSubsection.description,
        questions: questions,
        orgScore: mean(questions.map((q) => q.orgScore)),
        industryNorm: mean(questions.map((q)=>q.industryNorm)),
        globalNorm: mean(questions.map((q)=>q.globalNorm)),
        scale: configSubsection.scale || 1,
        scaleInterval: configSubsection.scaleInterval || 1,
        scaleExplanation: configSubsection.scaleExplanation,
        showAsPercent: configSubsection.showAsPercent,
        excludeIndustryNorms: configSubsection.excludeIndustryNorms,
        excludeGlobalNorms: configSubsection.excludeGlobalNorms,
        excludeHeader: configSubsection.excludeHeader,
        excludeKey: configSubsection.excludeKey
    }
}

function transformQuestion(data:types.RawDatum[], configQuestion:types.ReportConfigQuestion, globalNorms:types.RawDatum, industryNorms:types.RawDatum):types.ReportQuestion {
    var points = dataPoints(data, configQuestion.id, configQuestion.includeNulls)
    var industryNorm = getNorm(industryNorms, configQuestion.id)
    var globalNorm = getNorm(globalNorms, configQuestion.id)
    var orgScore = mean(points)
    if (_.isNaN(orgScore)) throw new Error("The orgScore for question "+configQuestion.id+" is NaN.")
    return {
        description: configQuestion.description,
        orgScore: orgScore,
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