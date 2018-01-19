#!/usr/bin/env node

import {curl, simple, update_index, url2fn} from "./utils";
import {appendFileSync, writeFileSync} from "fs";

const ora = require("ora");
const chalk = require('chalk');
const program = require('commander');
const package_config = require('../package.json');
const inquirer = require('inquirer');
const {Subject} = require('rxjs');
const model = require('./model');

// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

const EXIT_KEYS = ["escape", "q"];

const ENTRY_LIMIT = 15;

async function search(query, options) {
    if (!options || !options.limit)
        return console.log(chalk.red('INTERNAL_ERROR: options.limit is not specified'));
    const entry_limit = options.limit || ENTRY_LIMIT;
    const search_prompt = {
        message: "Search result from Google Scholar",
        type: "list",
        default: 0,
        pageSize: entry_limit + 2
    };

    let spinner = ora(`searching google scholar for ${chalk.green(query)}`).start();
    let results = await model.search(query, {limit: entry_limit});
    let choices = results.map(simple);
    spinner.stop();

    function exit(ch, key) {
        if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
        prompt.ui.close();
        console.log(chalk.green(`\nExit on <${key.name}> key~`));
        process.stdin.removeListener('keypress', exit); // complete unnecessary LOL
    }

    let prompt = inquirer.prompt({
        ...search_prompt,
        name: "selection",
        choices
    });

    process.stdin.on('keypress', exit);
    const {selection} = await prompt;
    let i = choices.indexOf(selection);
    const selected = results[i];

    const fn = url2fn(selected.pdfUrl);
    try {
        curl(selected.pdfUrl, fn);
        console.log(chalk.green("✓"), "pdf file is saved");
    } catch (e) {
        console.log(chalk.red("✘"), "pdf file saving failed due to", e);
    }
    try {
        selected.files = [...(selected.files || []), fn];
        // appendFileSync(".yatta.json", JSON.stringify(results[i]));
        update_index(".yatta.yml", selected);
        console.log(chalk.green("✓"), "bib entry attached");
    } catch (e) {
        console.log(chalk.red("✘"), "failed to append bib entry due to", e);
    }


    // prompt = inquirer.prompt({
    //     ...search_prompt,
    //     message: "",
    //     name: "selection",
    //     items: []
    // })
}

program
    .version(package_config.version)
    .option('-d, --directory', 'the directory to apply yatta. Default to ')
    .option('-R, --recursive', 'flag to apply yatta recursively');

program
    .command('search <query>')
    .option('--limit <limit>', "limit for the number of results to show on each search", parseInt, ENTRY_LIMIT)
    .action(search);
program
    .parse(process.argv);
