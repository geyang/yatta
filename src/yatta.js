#!/usr/bin/env node

import {
    curl, DEFAULT_CONFIG, dot, dot_update, dump_index, ENTRY_LIMIT, INDEX_PATH,
    init_index, load_index, simple, update_index, url2fn
} from "./utils";
import {sleep} from "../dist/utils";
import * as backends from "./backends";
import {ERR_BOT} from "./backends/google-scholar";
import {join as pathJoin} from "path";

const ora = require("ora");
const fs = require("fs");
const chalk = require('chalk');
const program = require('commander');
const package_config = require('../package.json');
const inquirer = require('inquirer');
const {Subject} = require('rxjs');
const open = require('opn');

// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs


const EXIT_KEYS = ["escape", "q"];


/** yatta init --index-path ".yatta" */
async function init(options) {
    const {indexPath = INDEX_PATH, ...restOpts} = options;
    if (fs.existsSync(indexPath))
        console.error(`index file ${indexPath} already exists.`);
    else {
        init_index(indexPath);
        console.log(chalk.green("✓"), `index file ${indexPath} is created!`);
    }
    return process.exit()
}

/** Setting yatta configurations
 * yatta set search.open true
 * yatta set search.limit 100
 * */
async function set(key, value, options) {
    //todo: use schema instead of this crapy hack
    if (value === "true") value = true;
    else if (value === 'false') value = false;
    else if (value.match(/^[0-9]*(\.)[.0-9]*$/)) value = parseFloat(value);

    if (typeof dot(DEFAULT_CONFIG, key.split('.')) === 'undefined') {
        console.error(`dot.key ${key} does not exist in the default configuration!`);
        process.exit();
    }
    const {indexPath = INDEX_PATH, ...restOpts} = options;
    if (!fs.existsSync(indexPath)) {
        console.error(`index file ${indexPath} does not exist. Use yatta init to initialize the file first!`);
        process.exit()
    }
    let index = load_index(indexPath);
    try {
        //todo: need to add casting, s.a. "true" => true
        let newIndex = dot_update(index, key.split('.'), value);
        dump_index(indexPath, newIndex);
        console.log(chalk.green("✓"), `index file ${indexPath} has been updated!`);
        console.log(newIndex);
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

async function list(query, options) {
    const {indexPath = INDEX_PATH, ...restOpts} = options;
    if (fs.existsSync(indexPath))
        console.error(`index file ${indexPath} already exists.`);
    else {
        let index = load_index(indexPath);
        console.log(chalk.green("✓"), `index file ${indexPath} is created!`);
    }
    return process.exit()
}

async function search(query, options) {
    const index = load_index(options.indexPath);
    const dir = index.dir || DEFAULT_CONFIG.dir;
    options = {...DEFAULT_CONFIG.search, ...(index.search || {}), ...options};
    if (!options.limit)
        return console.error(chalk.red('OPTION_ERROR: options.limit is not specified or 0'));
    // add options.backend
    const search = backends.SOURCES[options.source];
    const sourceName = backends.NAMES[options.source];
    const search_page = backends.SEARCH_PAGES[options.source];
    const search_url = backends.SEARCH_URL[options.source];
    if (!search && typeof search === "function")
        return console.error(chalk.red(`OPTION_ERROR: options.source is not in the white list ${backends.SOURCES}`));

    const search_prompt = {
        message: `Results by ${sourceName}`,
        type: "checkbox",
        default: 0,
        pageSize: options.limit * 2 // when this is less than the real screen estate, it gets very ugly.
        // todo: measure the actual height of the screen
    };

    console.log(`this search could be found at\n${search_page(query)}`);
    console.log(`api call at \n${search_url(query)}`);

    let spinner = ora(`searching ${chalk.yellow(sourceName)} for ${chalk.green(query.join(' '))}`).start();
    let results;
    try {
        ({results} = await search(query, options.limit));
    } catch (e) {
        spinner.stop();
        if (e.code === ERR_BOT)
            console.error(chalk.green("\nYou are detected as a bot\n"), e);
        else
            console.error(chalk.red('\nsomething went wrong during search\n'), e);
        process.exit();
    }
    spinner.stop();
    let choices = results.map(simple).slice(0, options.limit);


    let selection, prompt;

    function exit(ch, key) {
        if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
        prompt.ui.close();
        console.log(chalk.green(`\nExit on <${key.name}> key~`));
        process.stdin.removeListener('keypress', exit);
        process.exit();
    }

    async function show_list() {
        prompt = inquirer.prompt({
            ...search_prompt,
            name: "selection",
            choices
        });

        process.stdin.on('keypress', exit);
        ({selection} = await prompt);
        process.stdin.removeListener('keypress', exit);
    }

    while (true) {
        await show_list();
        spinner = ora(`working`).start();
        const tasks = selection.map(async function (title, index) {
            const selected = results[choices.indexOf(title)];
            if (!selected.pdfUrl) {
                spinner.warn(chalk.yellow('href to PDF file does not exist with this entry.'));
                spinner.info(selected);
            }
            const fn = pathJoin(dir, url2fn(selected.pdfUrl));
            try {
                if (fs.existsSync(fn)) {
                    spinner.warn(`the file ${fn} already exists! Skipping the download.`);
                } else {
                    // todo: use unified single spinner for the entire parallel task stack.
                    spinner.info(`downloading ${selected.pdfUrl} to ${fn}`);
                    await curl(selected.pdfUrl, fn);
                    spinner.succeed("pdf file is saved");
                }
                if (options.open) {
                    spinner.info(chalk.green(`opening the pdf file ${fn}`));
                    // "You can change this setting using either\n\t1. the `-O` flag or \n\t2. the `yatta.yml` config file.");
                    await sleep(200);
                    open(fn)
                }
            } catch (e) {
                spinner.fail(`failed to save ${fn} due to`);
                console.log(e);
            }
            try {
                selected.files = [...(selected.files || []), fn];
                update_index(options.indexPath, selected);
                spinner.succeed("bib entry attached");
            } catch (e) {
                spinner.fail("failed to append bib entry due to");
                console.log(e, selected);
            }
        });
        await Promise.all(tasks);
        spinner.stop();
    }
}

program
    .version(package_config.version)
    .option('-d, --directory', 'the directory to apply yatta. Default to ')
    .option('-R, --recursive', 'flag to apply yatta recursively');

program
    .command('init')
    .option('--index-path <index path>', "path for the yatta.yml index file", INDEX_PATH)
    // we DO NOT offer config option to keep it simple
    // .option('-O --open', "open the downloaded pdf file")
    .action(init);

program
    .command('set <key.path> <value>')
    .description(`modifies the configuration file, located at ${INDEX_PATH} by default. Use dot separated path string as the key.`)
    .option('--index-path <index path>', `path for the ${INDEX_PATH} index file`, INDEX_PATH)
    .action(set);

program
    .command('search <query...>', {isDefault: true})
    .description(`Search for papers with google-scholar and arxiv!

  Examples:
      ~> ${chalk.green('yatta search -s arxiv "compress and control" au:bellemare"')}
      # >> generates a query ${chalk.blue('("compress and control" AND au:bellemare)')}
      ~> ${chalk.green('yatta search -s arxiv electrons on helium schuster')}
      # >> generates a query ${chalk.blue('(schuster AND (helium AND (electrons AND on)))')}
      
  We use a carefully designed parsing logic to generate the query AST for arxiv.org.
  This is a LOT easier to use than the clunky arxiv website!`)
    // todo: do validation here in the spec.
    .option(`-s --source <${Object.keys(backends.SOURCES)}>`,
        `The search backend to use, choose among ${Object.keys(backends.SOURCES)}. Default is ${backends.GOOGLE_SCHOLAR}`,
        (s) => s.toLowerCase())
    .option('--limit <limit>', `limit for the number of results to show on each search. Default is ${ENTRY_LIMIT}`, parseInt)
    .option('--index-path <index path>', "path for the yatta.yml index file", INDEX_PATH)
    .option('-O --open', "open the downloaded pdf file")
    .action(search);

program
    .parse(process.argv);
