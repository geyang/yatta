#!/usr/local/bin/node

const program = require('commander');
const package = require('../package.json');


program
    .version(package.version)
    .option('-d --directory', 'the directory to apply yatta')
    .option('-R --recursive', 'flag to apply yatta recursively')
    .parse(process.argv);
