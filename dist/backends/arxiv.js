"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.search = search;

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Created by ge on 1/20/18. */
function makeUrl(query) {
    var max_results = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var sort_by = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "submittedDate";

    return "http://export.arxiv.org/api/query?sortBy=" + sort_by + "&max_results=" + max_results + "&search_query=" + query;
}

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

function coerceQuery(query) {
    if (typeof query === "string") {
        return query;
    } else {
        var queries = [];
        var v = void 0;
        for (var k in query) {
            if (query.hasOwnProperty(k)) {
                v = query[k];
                k = coerceQueryKey(k);
                v = coerceQueryValue(k, v);
                queries.push([k, v].join(':'));
            }
        }return queries.join('+AND+');
    }
}

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
    return {
        id: entry.id[0],
        updated: new Date(entry.updated[0]),
        published: published,
        year: published.getFullYear(),
        title: entry.title[0].trim().replace(/\s+/g, ' '),
        summary: entry.summary[0].trim().replace(/\s+/g, ' '),
        links: entry.link.map(function (link) {
            return {
                href: link['$']['href'],
                title: link['$']['title']
            };
        }),
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