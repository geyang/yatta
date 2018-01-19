/** Created by ge on 1/19/18. */
import chalk from "chalk";
import {parse as urlParse} from "url";
import path from "path";
import http from "http";
import yaml from "js-yaml";
import fs from "fs-extra";

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function $aus(authors) {
    const first_author = authors[0];
    if (authors.length > 1) {
        return chalk.green(first_author.name) + chalk.gray(", et.al.")
    } else {
        return chalk.green(first_author.name)
    }
}

export function simple({title, authors, pdf}, i) {
    return `${i}. ${chalk.green($aus(authors))}, ${title}`
}

export function url2fn(url) {
    const parsed = urlParse(url);
    return path.basename(parsed.pathname);
}


export function curl(url, targetPath) {
    const file = fs.createWriteStream(targetPath);
    url = url.replace(/^https/, "http");
    http.get(url, (response) => response.pipe(file));
}


const DEFAULT_DIR = "./";
const DEFAULT_INDEX = {dir: DEFAULT_DIR};

export function update_index(indexPath, entry) {
    fs.ensureFileSync(indexPath);
    let index, content;
    try {
        content = fs.readFileSync(indexPath, 'utf8');
        if (!content) index = DEFAULT_INDEX;
        else {
            index = yaml.safeLoad(content);
            if (typeof index !== 'object')
                throw new Error(`index file ${indexPath} seems to be ill-formed.`);
            fs.copySync(indexPath, indexPath.trim() + ".backup", {overwrite: true});
        }
    } catch (err) {
        console.log(f`Failed to read index file due to ${err}`);
        throw err;
    }
    // todo: use dictionary instead;
    index.papers = [...(index.papers || []), entry];
    content = yaml.safeDump(index, {'sortKeys': true});
    fs.writeFileSync(indexPath, content);
}

// update_index(".yatta.yml", {name: "test"});