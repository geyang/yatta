"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
var validate = function validate(q) {
    return q.match(/^[A-z]+:[^:]+$/);
};
var hasKey = function hasKey(q) {
    return q.match(/\b[A-z]+:.+/);
};
var getKeyValue = function getKeyValue(q) {
    return q.match(/([A-z]+):(.+)/).slice(1, 3);
};

function parse_query(query, join, exactOp, andOp, orOp) {
    //todo: if (query.length == 1) { /*this is raw. We do NOT handle this.*/ }
    var queryContext = [];
    var last = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(query), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var q = _step.value;

            q = q.trim();
            if (hasKey(q)) {
                /* push stuff to context */
                var _getKeyValue = getKeyValue(q),
                    _getKeyValue2 = (0, _slicedToArray3.default)(_getKeyValue, 2),
                    key = _getKeyValue2[0],
                    value = _getKeyValue2[1];

                queryContext.push({ key: key, value: [exactOp(value)] });
            } else if (!last) {
                /*take last from context and push to it*/
                last = { value: [exactOp(q)] };
                queryContext.push(last);
            } else {
                /*make last, and push to it*/
                last.value.push(exactOp(q));
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

    return queryContext.map(function (_ref) {
        var key = _ref.key,
            value = _ref.value;
        return join(key, value.reduce(andOp));
    }).reduce(andOp);
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
        url: links.filter(function (_ref2) {
            var title = _ref2.title;
            return !title;
        })[0].href,
        pdfUrl: links.filter(function (_ref3) {
            var title = _ref3.title;
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
        _request2.default.get(search_url(query, limit, sortBy), function (err, resp, data) {
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
    return "https://arxiv.org/find/all/1/" + parse_query(query, function (k, v) {
        return k ? k + ":+" + v : v;
    }, function (s) {
        return "EXACT+" + s.replace(/\s+/g, '_');
    }, polish('and'), polish('or')) + "/0/1/0/all/0/1";
}

function search_url(query) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
    }

    return makeUrl.apply(undefined, [parse_query(query, function (k, v) {
        return k ? k + ":" + v : v;
    }, function (s) {
        return "\"" + s + "\"";
    }, infix('and'), infix('or'))].concat(rest));
}