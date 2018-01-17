#!/usr/local/bin/node
// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs
const program = require('commander');
const package = require('../package.json');


program
    .version(package.version)
    .option('-d --directory', 'the directory to apply yatta')
    .option('-R --recursive', 'flag to apply yatta recursively')
    .parse(process.argv);
