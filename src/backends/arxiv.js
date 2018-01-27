/** Created by ge on 1/20/18. */
import request from "request";
import xml2js from "xml2js";
import {isArray} from "../utils";

function makeUrl(query, max_results = 100, sort_by = "submittedDate") {
    return `http://export.arxiv.org/api/query?sortBy=${sort_by}&max_results=${max_results}&search_query=${query}`;
}

const key_map = {author: 'au', q: 'all', title: 'ti', category: 'cat'};

function coerceQueryKey(key) {
    return key_map[key] || key;
}

function coerceQueryValue(key, value) {
    let matched;
    if (key === 'au') {
        if (matched = value.match(/^(\w+).* (\w+)$/)) {
            return matched[2] + '_' + matched[1][0];
        } else {
            return value;
        }
    } else {
        return value;
    }
}

function polish(op) {
    return (acc, b, index) => op.trim().toUpperCase() + `+` + ((index === 1) ? `${acc}+${b}` : `${b}+${acc}`);
}

function infix(op) {
    return (acc, b, index) => ((index === 1) ? `(${acc} ${op.trim().toUpperCase()} ${b})` : `(${b} ${op.trim().toUpperCase()} ${acc})`);
}

// console.log('electrons on helium'.split(' ').reduce(polish('and')));

function name_regularization(...names) {
    if (names.length <= 1) return names.join('_');
    const last = names.pop();
    return [last, ...names].join('_');
}

// console.log(name_regularization('ge', 'yang'));

/**
 * query: a list of strings, of the form ["au:some", "text", "actual-lastname", "ti:like" "this", "all:typical query", "cat:cs"]
 * returns AND+au:+some+text+AND+ti:+like+this
 * should ['ti:"compress and control"']
 * return: ti:+EXACT+compress_and_control
 *
 * haha obviously a query is NOT a regular express. For example,
 *      `yatta search ti:"compress and control" ti:"neural episodic controller"`
 * implies that the two titles have an OR relationship. However,
 *      `yatta search au:"bellemare" ti:"compress and control"`
 * implies that the two are AND.
 * What we can do is to treat "," as OR, and space and AND.
 * */
const validate = (q) => q.match(/^[A-z]+:[^:]+$/);
const hasKey = (q) => q.match(/\b[A-z]+:.+/);
const getKeyValue = (q) => q.match(/([A-z]+):(.+)/).slice(1, 3);

function parse_query(query, join, exactOp, andOp, orOp) {
    //todo: if (query.length == 1) { /*this is raw. We do NOT handle this.*/ }
    const queryContext = [];
    let last;
    for (let q of query) {
        q = q.trim();
        if (hasKey(q)) {  /* push stuff to context */
            let [key, value] = getKeyValue(q);
            queryContext.push({key, value: [exactOp(value)]})
        } else if (!last) {/*take last from context and push to it*/
            last = {value: [exactOp(q)]};
            queryContext.push(last);
        } else { /*make last, and push to it*/
            last.value.push(exactOp(q))
        }
    }
    return queryContext.map(({key, value}) => join(key, value.reduce(andOp))).reduce(andOp);
}


function unique(a, k) {
    let a_, i, j, known, len;
    a_ = [];
    known = {};
    for (j = 0, len = a.length; j < len; j++) {
        i = a[j];
        if (!known[i[k]]) {
            known[i[k]] = true;
            a_.push(i);
        }
    }
    return a_;
}

function coerceEntry(entry) {
    const published = new Date(entry.published[0]);
    const links = entry.link.map(function (link) {
        return {
            href: link['$']['href'] || "",
            title: link['$']['title'] || ""
        };
    });
    return {
        id: entry.id[0],
        updated: new Date(entry.updated[0]),
        published,
        year: published.getFullYear(),
        month: published.getMonth() + 1, // month is 0-11
        title: entry.title[0].trim().replace(/\s+/g, ' '),
        summary: entry.summary[0].trim().replace(/\s+/g, ' '),
        //todo: allow multiple links, do the same for Google Scholar. Reference standard bib from Mendeley.
        links,
        url: links.filter(({title}) => !title)[0].href,
        pdfUrl: links.filter(({title}) => title === "pdf").slice(-1)[0].href, //pick the last one.
        authors: unique(entry.author.map(function (author) {
            return {
                name: author['name'][0]
            };
        }), 'name'),
        categories: entry.category.map(function (category) {
            return category['$']['term'];
        })
    };
}

export function search(query, limit, sortBy) {
    return new Promise((resolve, reject) => {
        request.get(search_url(query, limit, sortBy), function (err, resp, data) {
            return xml2js.parseString(data, function (err, parsed) {
                let results, ref, ref1, total;
                if (err != null) {
                    reject(err);
                } else {
                    results = parsed != null ? (ref = parsed.feed) != null ? (ref1 = ref.entry) != null ? ref1.map(coerceEntry) : void 0 : void 0 : void 0;
                    results || (results = []);
                    total = Number(parsed.feed['opensearch:totalResults'][0]['_']);
                    total || (total = 0);
                    resolve({results, total});
                }
            });
        });
    });
}

export function search_page(query) {
    return `https://arxiv.org/find/all/1/${parse_query(query, (k, v) => k ? `${k}:+${v}` : v, (s) => `EXACT+${s.replace(/\s+/g, '_')}`, polish('and'), polish('or'))}/0/1/0/all/0/1`
}


export function search_url(query, ...rest) {
    return makeUrl(parse_query(query, (k, v) => k ? `${k}:${v}` : v, (s) => `"${s}"`, infix('and'), infix('or')), ...rest);
}
