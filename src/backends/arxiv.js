/** Created by ge on 1/20/18. */
import request from "request";
import xml2js from "xml2js";

function makeUrl(query, max_results = 100, sort_by = "submittedDate") {
    return `http://export.arxiv.org/api/query?sortBy=${sort_by}&max_results=${max_results}&search_query=${query}`;
}

const key_map = {
    author: 'au',
    q: 'all',
    title: 'ti',
    category: 'cat'
};

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

function coerceQuery(query) {
    if (typeof query === "string") {
        return query;
    } else {
        const queries = [];
        let v;
        for (let k in query) if (query.hasOwnProperty(k)) {
            v = query[k];
            k = coerceQueryKey(k);
            v = coerceQueryValue(k, v);
            queries.push([k, v].join(':'));
        }
        return queries.join('+AND+');
    }
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

