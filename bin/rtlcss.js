#!/usr/bin/env node
var path = require('path'),
    fs = require('fs'),
    sys = require('util'),
    rtlcss = require('../lib/rtlcss'),
    configLoader = require('../lib/config-loader'),
    chalk = require('chalk')
;

var shouldBreak = false, inputFile,outputFile,config;
var currentErrorcode, arg, args = process.argv.slice(2);

process.on('exit', function() { process.reallyExit(currentErrorcode) });

function printWarning (){
  console.log(chalk.yellow.apply(this,printWarning.arguments));
}

function printInfo (){
  console.log(chalk.green.apply(this,printInfo.arguments));
}

function printError (){
  console.log(chalk.red.apply(this,printError.arguments));
}

function printHelp(){    
  console.log('Usage: rtlcss [option option=parameter ...] [source] [destination]');
  console.log('');
  var options = 
  [
      'Option '       ,'Description ',
      '--------------','----------------------------------------------',
      '-h,--help'     ,'Print help (this message) and exit.',
      '-v,--version'  ,'Print version number and exit.',
      '-c,--config'   ,'Path to configuration settings file.',
      '- ,--stdin'    ,'RTLCSS will read from stdin stream.'
  ];

  for(var x=0;x<options.length;x++)
    console.log(options[x++],'\t',options[x]);

  console.log('');
  console.log('*If no destination is specified, output will written to {source name}.rtl.{ext} ');
  console.log('');
  printInfo('RTLCSS version: ' + require('../package.json').version);
  printInfo('Report issues to: https://github.com/MohammadYounes/rtlcss/issues');        
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
      printInfo('rtlcss version: ' + require('../package.json').version);
      shouldBreak = true;
      break;
    case '-c':
    case '--config':
      arg = args.shift();
      try
      {
        config = configLoader.load(path.resolve(arg));
      }
      catch(e)
      {
        printError('rtlcss: invalid config file. ', e);
        shouldBreak = true;
        currentErrorcode = 1;
      }
      break;
    case '-':
    case '--stdin':
      inputFile = '-';
      break;
    default:
      if(arg[0] == '-'){
        printError('rtlcss: unknown option. ' + arg);
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
  printError('rtlcss: no input file');
  console.log('');
  printHelp();
  return;
}
if(!config && inputFile !== '-'){
  try{
		
    config = configLoader.load(null, path.dirname(inputFile));
  }catch(e){
    printError('rtlcss: invalid config file. ', e);
    currentErrorcode = 1;
    return;
  }
}

if(!outputFile && inputFile !== '-')
  outputFile = path.extname(inputFile) ? inputFile.replace(/\.[^.]*$/, function(ext){ return '.rtl' + ext;}) : inputFile + '.rtl';

var processCSSFile = function (e, data) {
  if (e) {
    printError('rtlcss: ' + e.message);
    return;
  }
  var result, opt = { map: undefined, from:undefined, to:undefined};
  if(!config){
    printWarning('rtlcss: Warning! No config present, using defaults.');
    result = rtlcss().process(data, opt);
  }else{

    if(config.map === true && inputFile !== '-'){
      opt.map = config.map;
      opt.from = inputFile;
      opt.to = outputFile;
    }

    result = rtlcss(config.options,
                    config.rules,
                    config.declarations,
                    config.properties).process(data, opt);
  }
    
  if (outputFile) {
    fs.writeFileSync(outputFile, result.css, 'utf8');
    if(opt.map == true){
      fs.writeFileSync(outputFile + '.map', result.map, 'utf8');
    }
  } else {
    sys.print(result.css);
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
  process.on('SIGINT', function(){
    processCSSFile(false, buffer);
    process.exit();
  });
  process.stdin.on('end', function() {
    processCSSFile(false, buffer);
  });
}