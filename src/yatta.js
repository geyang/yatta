#!/usr/bin/env node

import {
    curl, DEFAULT_CONFIG, dot, dot_update, dump_index, ENTRY_LIMIT, INDEX_PATH,
    init_index, load_index, update_index, url2fn
} from "./utils";
import {sleep} from "./utils";
import * as backends from "./backends";
import {ERR_BOT} from "./backends/google-scholar";
import {join as pathJoin} from "path";
import {pdfResolver} from "./resolver";
import {readPdf, listFiles} from "./modules/pdf";
import {full, simple} from "./formatters";

const ora = require("ora");
const fs = require("fs-extra");
const chalk = require('chalk');
const program = require('commander');
const package_config = require('../package.json');
const inquirer = require('inquirer');
const {Subject} = require('rxjs');
const open = require('opn');
import format from 'js-pyformat';
// format.extend(String.prototype, {});

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
    if (!key) {
        const {papers, ...rest} = load_index(indexPath);
        console.log(rest);
        process.exit();
    }
    //todo: use schema instead of this crapy hack
    if (value === "true") value = true;
    else if (value === 'false') value = false;
    else if (value.match(/^[0-9]*(\.)[.0-9]*$/)) value = parseFloat(value);

    if (typeof dot(DEFAULT_CONFIG, key.split('.')) === 'undefined') {
        console.error(`dot.key ${key} does not exist in the default configuration!`);
        process.exit();
    }
    const {indexPath = INDEX_PATH, ...restOpts} = options;
    let spinner = ora(`setting ${chalk.blue(indexPath)} file`).start();
    if (!fs.existsSync(indexPath)) {
        spinner.fail(`index file ${indexPath} does not exist. Use yatta init to initialize the file first!`);
        process.exit()
    }
    if (key === 'dir') try {
        let made = fs.ensureDirSync(value);
        if (made) spinner.succeed(`Creating a new folder ${value}!`)
    } catch (err) {
        spinner.fail(err);
        process.exit()
    }
    let index = load_index(indexPath);
    try {
        spinner.start(`updating index file ${indexPath}`);
        //todo: need to add casting, s.a. "true" => true
        let newIndex = dot_update(index, key.split('.'), value);
        dump_index(indexPath, newIndex);
        spinner.succeed(chalk.green("✓"), `index file ${indexPath} has been updated!`);
        const {papers, ...rest} = newIndex;
        console.log(rest);
    } catch (err) {
        spinner.fail(err);
    }
    process.exit();
}

async function list(options) {
    // todo: add prompt to open current files
    // todo: <rename> change file name
    // todo: <meta> add title and authors
    // todo: <link> with bib
    // todo: model should include: bib:..., original filename, pdf content.
    const {indexPath = INDEX_PATH, ...restOpts} = options;
    const index_config = load_index(indexPath);
    const papers = index_config.papers || DEFAULT_CONFIG.papers;
    const dir = index_config.dir || DEFAULT_CONFIG.dir;
    papers.map(p => ({...p, authors: p.authors.map(a => a.name)})).map(full).join('\n');
    const files = listFiles(dir).filter(f => f.match(/\.pdf$/)).map(f => pathJoin(dir, f));
    const spinner = ora('looking through your files...').start();
    const pdfs = await Promise.all(files.map(async function (f) {
        try {
            return await readPdf(f)
        } catch (e) {
            console.log(e);
        }
    }));
    const choices = pdfs.filter(d => !!d).map(d => ({...d, ...d.meta})).map(full);
    spinner.succeed();

    const search_prompt = {
        message: `local files`,
        type: "list",
        find: true,
        default: 5,
        pageSize: choices.length * 2 // when this is less than the real screen estate, it gets very ugly.
        // todo: measure the actual height of the screen
    };

    let prompt;

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
        const {selection} = await prompt;
        process.stdin.removeListener('keypress', exit);
        return selection;
    }

    while (true) {
        const selection = await show_list();
        const selection_index = choices.indexOf(selection);
        search_prompt.default = selection_index;
        const filename = files[selection_index];
        if (filename) open(filename);
    }

    // return process.exit()
}

async function search(query, options) {
    let index_config = load_index(options.indexPath);
    index_config = {
        ...DEFAULT_CONFIG, ...index_config,
        search: {...DEFAULT_CONFIG.search, ...index_config.search, ...options}
    };
    const dir = index_config.dir;
    options = index_config.search;
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
        find: true,
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
        spinner = ora();
        const tasks = selection.map(async function (title, index) {
            const selected = results[choices.indexOf(title)];
            let url = pdfResolver(selected.url, selected.pdfUrl);
            if (!url) {
                spinner.fail(`url ${JSON.stringify(selected.url)} and pdfUrl "${JSON.stringify(selected.pdfUrl)}" 
                    are not resolving correctly. Please feel free to email ${package_config.author}`);
                process.exit();
            }
            // make this configurable
            const authors = selected.authors.map(a => a.name);

            const fn = pathJoin(dir, format(index_config.filename, {
                ...selected,
                YY: selected.year ? `0${selected.year % 100}`.slice(-2) : "",
                MM: selected.month ? `0${selected.month}`.slice(-2) : "",
                authors: authors.join(', '),
                firstAuthor: (authors[0] || "NA"),
                filename: url2fn(url)
            }));
            try {
                if (fs.existsSync(fn)) {
                    spinner.warn(`the file ${fn} already exists! Skipping the download.`);
                } else {
                    // done: download link resolution:
                    // todo: use unified single spinner for the entire parallel task stack.
                    spinner.start(`downloading ${url} to ${fn}`);
                    await curl(url, fn);
                    spinner.succeed(`saved at ${fn}; ` + chalk.red('If corrupted, go to:') + " " + url);
                }
                if (options.open) {
                    spinner.start(chalk.green(`opening the pdf file ${fn}`));
                    // "You can change this setting using either\n\t1. the `-O` flag or \n\t2. the `yatta.yml` config file.");
                    await sleep(200);
                    open(fn)
                }
            } catch (e) {
                spinner.fail(`failed to save ${fn} due to`);
                console.log(e);
            }
            try {
                spinner.start("attaching bib entry");
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
    .action(init);

program
    .command('list')
    .option('--index-path <index path>', "path for the yatta.yml index file", INDEX_PATH)
    .action(list);

program
    .command('set [key.path] [value]')
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
