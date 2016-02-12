declare var __dirname;
declare var process;
var cp = require('child_process')
var fs = require('fs')
var path = require('path')
import _ = require('lodash')
var parseArgs = require('minimist')


// Read args

interface ReportConfig {
    configPath: string;
    dataDir: string;
    globalNormsPath: string;
    industryNormsPath: string;
    industryCodesPath: string;
    destDir: string;
}

function main() {
    var args = parseArgs(process.argv.slice(2))

    if (!args.config){
        console.log("missing --config")
        return
    } else if (!args.destDir) {
        console.log("missing --destDir")
        return
    } else if (!args.dataDir){
        console.log("missing --dataDir")
        return
    } else if (!args.globalNorms) {
        console.log("missing --globalNorms")
        return
    } else if (!args.industryNorms) {
        console.log("missing --industryNorms")
        return
    } else if (!args.industryCodes) {
        console.log('missing --industryCodes')
        console.log("Usage: node src/run-dir.js --globalNorms /path/to/globalNorms.csv --industryNorms /path/to/industry-norms.csv --config /path/to/config.json --dataDir /path/to/data/folder --industryCodes /path/to/industry/codes --destDir /path/to/destination/folder")
        return
    }

    var reportConfig = {
        configPath : args.config,
        dataDir : args.dataDir,
        globalNormsPath : args.globalNorms,
        industryNormsPath : args.industryNorms,
        industryCodesPath : args.industryCodes,
        destDir : args.destDir
    }

    /// get paths
    var paths = dirPaths(reportConfig.dataDir)



    //process
    paths.forEach((dataPath:string) => processReport(dataPath, reportConfig))

}

main()





function processReport(dataPath:string, c:ReportConfig) {
    var fName = fileName(dataPath)
    var companyCode = _.last(fName.split('-'))  // we require a format like hrsc-2003.csv
    var destPath = path.join(c.destDir, fName+'.pdf')
    var command = [
        'node', 'src/index.js',
        '--config', c.configPath,
        '--dest', destPath,
        '--data', dataPath,
        '--globalNorms', c.globalNormsPath,
        '--industryNorms', c.industryNormsPath,
        '--industryCodes', c.industryCodesPath,
        '--companyId', companyCode
    ].join(' ')

    console.log("---","Processing", companyCode, "---")
    // console.log(command)
    return cp.execSync(command, { stdio: 'inherit' })
}



function dirPaths(dir:string):string[] {
    var fileNames = fs.readdirSync(dir)
    return fileNames.map((name) => path.join(dir, name))
}

function fileName(dataPath:string):string {
     return path.basename(dataPath, ".csv")
}