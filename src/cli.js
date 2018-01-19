#!/usr/bin/env node

/** Created by ge on 1/18/18. */
'use strict';

const meow = require('meow');
const ora = require('ora');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const inquirer = require('inquirer');
const fs = require("fs");
const {retrieve, search, sources} = require('./helper');

const MAX_ARTICLES = 10;
const validSources = Object.keys(sources)
    .map(s => s.toLowerCase())
    .join(', ');

const cli = meow(`
  Usage:
    $ yatta <query>

  Options:
    --source, -s Where to find papers from (default: acm) - valid options: [${
        validSources
        }]

  Examples:
    $ yatta bayou
    $ yatta --source google zaharia spark
`,
    {
        flags: {
            source: {
                type: 'string',
                default: "gscholar",
                alias: 's'
            }
        }
    }
);

function buildQuestions(articles) {
    const choices = articles.map(({id, title, authors}, i) => ({
        value: id,
        name: `${title} ${chalk.dim(`(${authors})`)}`
    }));

    return [
        {
            choices,
            pageSize: Infinity,
            type: 'list',
            name: 'article',
            message: 'Which article are you looking for?'
        }
    ];
}

async function main() {
    const query = cli.input.join(' ');
    const source = cli.flags.source.toUpperCase();
    if (!query) cli.showHelp();
    if (!sources[source]) {
        const symbol = chalk.yellow('⚠');
        console.log(`${symbol} Valid sources are: ${validSources}`);
        process.exit(1);
    }

    const spinner = ora(`Searching for '${query}'`).start();
    let articles;
    try {
        articles = await search(source, query);
        articles = articles.slice(0, MAX_ARTICLES);
        spinner.stop();
    } catch (e) {
        spinner.fail(`Something went wrong while searching: ${e}`);
        process.exit(1);
    }

    if (!articles.length) {
        spinner.info(`No results found for query '${query}'.`);
        process.exit(0);
    }

    const questions = buildQuestions(articles);
    const {article} = await inquirer.prompt(questions);

    spinner.start('Retrieving BibTeX reference');
    let reference;
    try {
        reference = await retrieve(source, article);
    } catch (e) {
        spinner.fail(`Something went wrong while retrieving reference: ${e}`);
        process.exit(1);
    }

    spinner.stop();
    console.log(reference);
    try {
        const fn = "./yatta.bib";
        fs.appendFileSync(fn, reference);
        spinner.succeed('Written to file ', fn);
        clipboardy.writeSync(reference);
        spinner.succeed('Copied to clipboard!');
    } catch (_e) {
        console.log(_e)
        // Ignore clipboard related errors - we've already
        // printed the reference nonetheless.
    }
}

main();
