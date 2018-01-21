"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.search = search;
exports.search_page = search_page;

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeUrl(query) {
    var max_results = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var sort_by = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "submittedDate";

    return "http://export.arxiv.org/api/query?sortBy=" + sort_by + "&max_results=" + max_results + "&search_query=" + query;
} /** Created by ge on 1/20/18. */


var key_map = {
    author: 'au',
    q: 'all',
    title: 'ti',
    category: 'cat'
};

function coerceQueryKey(key) {
    return key_map[key] || key;
}

function coerceQueryValue(key, value) {
    var matched = void 0;
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

/**
 * query: a list of strings, of the form ["au:some", "text" "ti:like" "this"]
 * returns AND+au:+some+text+AND+ti:+like+this
 * */
function coerceQuery(query) {
    return query.join('+').replace(/(^|\+)(au|ti|all|cat:)/g, "AND+$2").replace(/:[^+]/g, ":+");
}

// const r = coerceQuery(["au:some", "text", "ti:like", "this"]);
// console.log(r);

function unique(a, k) {
    var a_ = void 0,
        i = void 0,
        j = void 0,
        known = void 0,
        len = void 0;
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
    var published = new Date(entry.published[0]);
    var links = entry.link.map(function (link) {
        return {
            href: link['$']['href'] || "",
            title: link['$']['title'] || ""
        };
    });
    return {
        id: entry.id[0],
        updated: new Date(entry.updated[0]),
        published: published,
        year: published.getFullYear(),
        title: entry.title[0].trim().replace(/\s+/g, ' '),
        summary: entry.summary[0].trim().replace(/\s+/g, ' '),
        //todo: allow multiple links, do the same for Google Scholar. Reference standard bib from Mendeley.
        links: links,
        url: links.filter(function (_ref) {
            var title = _ref.title;
            return !title;
        })[0].href,
        pdfUrl: links.filter(function (_ref2) {
            var title = _ref2.title;
            return title === "pdf";
        }).slice(-1)[0].href, //pick the last one.
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

function search(query, limit, sortBy) {
    return new _promise2.default(function (resolve, reject) {
        _request2.default.get(makeUrl(coerceQuery(query), limit, sortBy), function (err, resp, data) {
            return _xml2js2.default.parseString(data, function (err, parsed) {
                var results = void 0,
                    ref = void 0,
                    ref1 = void 0,
                    total = void 0;
                if (err != null) {
                    reject(err);
                } else {
                    results = parsed != null ? (ref = parsed.feed) != null ? (ref1 = ref.entry) != null ? ref1.map(coerceEntry) : void 0 : void 0 : void 0;
                    results || (results = []);
                    total = Number(parsed.feed['opensearch:totalResults'][0]['_']);
                    total || (total = 0);
                    resolve({ results: results, total: total });
                }
            });
        });
    });
}

function search_page(query) {
    return "https://arxiv.org/find/all/1/" + coerceQuery(query) + "/0/1/0/all/0/1";
}