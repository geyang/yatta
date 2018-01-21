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
    return (acc, b) => `${op.trim().toUpperCase()}+${b}+${acc}`;
}

function name_regularization(...names) {
    if (names.length <= 1) return names.join('_');
    const last = names.pop();
    return [last, ...names].join('_');
}

// console.log(name_regularization('ge', 'yang'));

/**
 * query: a list of strings, of the form ["au:some", "text", "actual-lastname", "ti:like" "this", "all:typical query", "cat:cs"]
 * returns AND+au:+some+text+AND+ti:+like+this
 * */
function coerceQuery(query) {
    const queryString = query.join(' ');
    const segments = queryString.split(/\s*\b([A-z]*:)\s*/).filter(s => !!s); //filter empty strings
    const queryContext = [];
    for (let s of segments) {
        let last = queryContext[queryContext.length - 1];
        if (s.match(/^[A-z]+:$/)) {
            last = {key: s};
            queryContext.push(last);
        } else if (last && last.key === 'au:') {
            last.value = name_regularization(...s.split(" "))
        } else if (last && last.key === 'cat:') {
            if (s.match(/\s/)) throw new Error(`"cat:${s}" is not parsing correctly because of the white space`);
            last.value = s;
        } else {
            if (!last) {
                last = {key: "all:"};
                queryContext.push(last);
            }
            last.value = s.split(' ').reduceRight(polish('and'))
        }
    }
    return queryContext.map(c => `${c.key}+${c.value}`).reduceRight(polish('and'))
}

// const r = coerceQuery(["au:some", "first", "lastname", "ti:like", "this", "and", "that", 'cat:stat.ml']);
// console.log(r);

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
        request.get(makeUrl(coerceQuery(query), limit, sortBy), function (err, resp, data) {
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
    return `https://arxiv.org/find/all/1/${coerceQuery(query)}/0/1/0/all/0/1`
}
