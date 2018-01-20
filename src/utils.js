/** Created by ge on 1/19/18. */
import chalk from "chalk";
import request from "request";
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
    let fn = path.basename(parsed.pathname).trim();
    // add pdf here.
    fn += !fn.match(/\.pdf$/) ? ".pdf" : "";
    return fn
}

const USER_AGENT = 'curl/7.52.1';
// doesn't work with arxiv
// 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7';

export function curl(url, targetPath) {
    const file = fs.createWriteStream(targetPath);
    url = url.replace(/^https/, "http");
    request({url, headers: {'User-Agent': USER_AGENT}}).pipe(file);
}

// curl("https://arxiv.org/pdf/1703.01988.pdf", "test.pdf");
// curl ("https://arxiv.org/pdf/1606.04460", "test.pdf");


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