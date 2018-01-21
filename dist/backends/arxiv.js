"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.search = search;
exports.search_page = search_page;
exports.search_url = search_url;

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


var key_map = { author: 'au', q: 'all', title: 'ti', category: 'cat' };

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

function polish(op) {
    return function (acc, b, index) {
        return op.trim().toUpperCase() + "+" + (index === 1 ? acc + "+" + b : b + "+" + acc);
    };
}

function infix(op) {
    return function (acc, b, index) {
        return index === 1 ? "(" + acc + " " + op.trim().toUpperCase() + " " + b + ")" : "(" + b + " " + op.trim().toUpperCase() + " " + acc + ")";
    };
}

// console.log('electrons on helium'.split(' ').reduce(polish('and')));

function name_regularization() {
    for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
        names[_key] = arguments[_key];
    }

    if (names.length <= 1) return names.join('_');
    var last = names.pop();
    return [last].concat(names).join('_');
}

// console.log(name_regularization('ge', 'yang'));

/**
 * query: a list of strings, of the form ["au:some", "text", "actual-lastname", "ti:like" "this", "all:typical query", "cat:cs"]
 * returns AND+au:+some+text+AND+ti:+like+this
 * */
function page_query_coersion(query) {
    var queryString = query.join(' ');
    var segments = queryString.split(/\s*\b([A-z]*:)\s*/).filter(function (s) {
        return !!s;
    }); //filter empty strings
    var queryContext = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(segments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            var last = queryContext[queryContext.length - 1];
            if (s.match(/^[A-z]+:$/)) {
                last = { key: s };
                queryContext.push(last);
            } else if (last && last.key === 'au:') {
                last.value = name_regularization.apply(undefined, (0, _toConsumableArray3.default)(s.split(" ")));
            } else if (last && last.key === 'cat:') {
                if (s.match(/\s/)) throw new Error("\"cat:" + s + "\" is not parsing correctly because of the white space");
                last.value = s;
            } else {
                if (!last) {
                    last = { key: "all:" };
                    queryContext.push(last);
                }
                last.value = s.split(' ').reduce(polish('and'));
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return queryContext.map(function (c) {
        return c.key + "+" + c.value;
    }).reduce(polish('and'));
}

// let r = page_query_coersion(["au:some", "first", "lastname", "ti:like", "this", "and", "that", 'cat:stat.ml']);
// console.log(r);

function api_query_coersion(query) {
    var queryString = query.join(' ');
    var segments = queryString.split(/\s*\b([A-z]*:)\s*/).filter(function (s) {
        return !!s;
    }); //filter empty strings
    var queryContext = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(segments), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var s = _step2.value;

            var last = queryContext[queryContext.length - 1];
            if (s.match(/^[A-z]+:$/)) {
                last = { key: s };
                queryContext.push(last);
            } else if (last && last.key === 'au:') {
                last.value = name_regularization.apply(undefined, (0, _toConsumableArray3.default)(s.split(" ")));
            } else if (last && last.key === 'cat:') {
                if (s.match(/\s/)) throw new Error("\"cat:" + s + "\" is not parsing correctly because of the white space");
                last.value = s;
            } else {
                if (!last) {
                    last = { key: "all:" };
                    queryContext.push(last);
                }
                last.value = s.split(' ').reduce(infix('and'));
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return queryContext.map(function (c) {
        return c.key + "\"" + c.value + "\"";
    }).reduce(infix('and'));
}

// r = api_query_coersion(["au:some", "first", "lastname", "ti:like", "this", "and", "that", 'cat:stat.ml']);
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
        _request2.default.get(makeUrl(api_query_coersion(query), limit, sortBy), function (err, resp, data) {
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
    return "https://arxiv.org/find/all/1/" + page_query_coersion(query) + "/0/1/0/all/0/1";
}

function search_url(query) {
    return makeUrl(api_query_coersion(query));
}