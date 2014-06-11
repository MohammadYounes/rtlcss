#!/usr/bin/env node
var path = require('path'),
    fs = require('fs'),
    sys = require('util'),
    rtlcss = require('../lib/rtlcss')
    chalk = require('chalk'),
    postcss = require('postcss');

var shouldBreak = false, inputFile,outputFile,config = {};
var arg, args = process.argv.slice(2);

function printInfo (){
    console.log(chalk.green.apply(this,printInfo.arguments));
}

function printError (){
    console.log(chalk.red.apply(this,printError.arguments));
}

function printHelp(){    
    console.log("Usage: rtlcss [option option=parameter ...] [source] [destination]");
    console.log("");
    var options = 
    [
        "Option "      ,"Description ",
        "--------------","----------------------------------------------",
        "-h,--help"     ,"Print help (this message) and exit.",
        "-v,--version"  ,"Print version number and exit.",
        "-c,--config"   ,"Path to configuration settings <config.json>.",
        "- ,--stdin"     ,"RTLCSS will read from stdin stream."
    ];

    for(var x=0;x<options.length;x++)
        console.log(options[x++],'\t',options[x]);

    console.log("");
    console.log("*If no destination is specified, output will written to {source name}.rtl.{ext} ");
    console.log("");
    printInfo("RTLCSS version: " + require('../package.json').version);
    printInfo("Report issues to: https://github.com/MohammadYounes/rtlcss/issues");        
}

while(arg = args.shift()){
    switch(arg){
        case '-h':
        case '--help':
            printHelp();
            shouldBreak = true;
            break;
        case '-v':
        case '--version':
            printInfo("rtlcss version: " + require('../package.json').version);
            shouldBreak = true;
            break;
        case '-c':
        case '--config':
            arg = args.shift();
            try
            {
                config = JSON.parse(fs.readFileSync(path.resolve(arg),'utf-8'));
            }
            catch(e)
            {
                printError('invalid config file:', e);
                shouldBreak = true;
            }
            break;
        case '-':
        case '--stdin':
            inputFile = '-';
            break;
        default:
            if(arg[0] == '-'){
                printError("unknown option: " + arg);
                shouldBreak = true;
            }else{
                if(!inputFile)
                    inputFile  = path.resolve(arg);
                else if(!outputFile)
                    outputFile = path.resolve(arg);
            }
            break;
    }
}

if(shouldBreak)
    return;

if (!inputFile) {
    printError("RTLCSS: no input file");
    console.log("");
    printHelp();
    return;
}

if(!outputFile && inputFile != "-")
    outputFile = path.extname(inputFile) ? inputFile.replace(/\.[^.]*$/, function(ext){ return ".rtl" + ext;}) : inputFile + ".rtl";

var processCSSFile = function (e, data) {
    if (e) {
        printError("rtlcss: " + e.message);
        return;
    }
    var processor = rtlcss(config.options,
                             config.rules,
                             config.declarations,
                             config.properties).postcss;
    var css =  postcss()
                .use(processor)
                .process(data,{ map: config.map, from:inputFile, to:outputFile});

    if (outputFile) {
        fs.writeFileSync(outputFile, css, 'utf8');
    } else {
        sys.print(css);
    }
};

if (inputFile != '-') {
    fs.readFile(inputFile, 'utf8', processCSSFile);
} else {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var buffer = '';
    process.stdin.on('data', function(data) {
        buffer += data;
    });

    process.stdin.on('end', function() {
        processCSSFile(false, buffer);
    });
}