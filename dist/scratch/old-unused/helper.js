"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var searchIeee = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query) {
        var res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return got.post(IEEE_SEARCH_URL, {
                            json: true,
                            headers: {
                                cookie: 'a=a',
                                origin: 'http://ieeexplore.ieee.org'
                            },
                            body: {
                                newsearch: 'true',
                                queryText: query
                            }
                        });

                    case 2:
                        res = _context.sent;

                        if (res.body.records) {
                            _context.next = 5;
                            break;
                        }

                        return _context.abrupt("return", []);

                    case 5:
                        return _context.abrupt("return", res.body.records.map(function (record) {
                            var authors = record.authors.map(function (_ref2) {
                                var preferredName = _ref2.preferredName;
                                return preferredName;
                            }).join(', ');

                            return {
                                authors: authors,
                                id: record.articleNumber,
                                title: record.title
                            };
                        }));

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function searchIeee(_x) {
        return _ref.apply(this, arguments);
    };
}();

var searchAcm = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(query) {
        var res, selector, detailsSelector;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return got(ACM_SEARCH_URL, { query: { query: query } });

                    case 2:
                        res = _context2.sent;
                        selector = cheerio.load(res.body);
                        detailsSelector = selector('.details');
                        return _context2.abrupt("return", detailsSelector.toArray().map(function (article) {
                            var articleSelector = selector(article);
                            var link = articleSelector.find('.title > a[href^=citation]');
                            var title = link.text();
                            var authors = articleSelector.find('.authors > a').toArray().map(function (author) {
                                return selector(author).text();
                            }).join(', ');

                            var _querystring$parse = querystring.parse(link.attr('href').split('?').pop()),
                                id = _querystring$parse.id;

                            return { id: id, title: title, authors: authors };
                        }));

                    case 6:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function searchAcm(_x2) {
        return _ref3.apply(this, arguments);
    };
}();

var searchScholar = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(query) {
        var res, selector, detailsSelector;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return got(SCHOLAR_SEARCH_URL, {
                            query: {
                                q: query,
                                hl: 'en'
                            }
                        });

                    case 2:
                        res = _context3.sent;
                        selector = cheerio.load(res.body);
                        detailsSelector = selector('.gs_r.gs_or.gs_scl');
                        return _context3.abrupt("return", detailsSelector.toArray().map(function (article) {
                            var articleSelector = selector(article);
                            var id = articleSelector.data('cid');
                            var title = articleSelector.find('.gs_rt > a').text();
                            var authors = articleSelector.find('.gs_a').text();
                            return { id: id, title: title, authors: authors };
                        }));

                    case 6:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function searchScholar(_x3) {
        return _ref4.apply(this, arguments);
    };
}();

var retrieveAcm = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id) {
        var query, res, selector;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        query = {
                            id: id,
                            expformat: 'bibtex'
                        };
                        _context4.next = 3;
                        return got(ACM_REFERENCE_URL, { query: query });

                    case 3:
                        res = _context4.sent;
                        selector = cheerio.load(res.body);
                        return _context4.abrupt("return", selector("pre[id=" + id + "]").text().trim());

                    case 6:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function retrieveAcm(_x4) {
        return _ref5.apply(this, arguments);
    };
}();

var retrieveScholar = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(id) {
        var query, res, selector, url, refRes;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        query = {
                            q: "info:" + id + ":scholar.google.com/",
                            output: 'cite'
                        };
                        _context5.next = 3;
                        return got(SCHOLAR_SEARCH_URL, { query: query });

                    case 3:
                        res = _context5.sent;

                        console.log(res);
                        selector = cheerio.load(res.body);
                        url = selector("a.gs_citi:contains(BibTeX)").attr('href');
                        _context5.next = 9;
                        return got(url);

                    case 9:
                        refRes = _context5.sent;
                        return _context5.abrupt("return", refRes.body.trim());

                    case 11:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function retrieveScholar(_x5) {
        return _ref6.apply(this, arguments);
    };
}();

var retrieveIeee = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(id) {
        var body, res;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        body = {
                            'citations-format': 'citation-only',
                            'download-format': 'download-bibtex',
                            recordIds: id
                        };
                        _context6.next = 3;
                        return got.post(IEEE_REFERENCE_URL, {
                            form: true,
                            body: body,
                            headers: {
                                cookie: 'a=a'
                            }
                        });

                    case 3:
                        res = _context6.sent;
                        return _context6.abrupt("return", cheerio.load(res.body).text().split('\n').map(function (line) {
                            return line.trimRight();
                        }).filter(function (line) {
                            return line;
                        }).join('\n'));

                    case 5:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function retrieveIeee(_x6) {
        return _ref7.apply(this, arguments);
    };
}();

/**
 * Retrieves the BibTeX reference for a given source and id.
 */


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var querystring = require("querystring");
var got = require("got");
var cheerio = require("cheerio");

var ACM_SEARCH_URL = 'https://dl.acm.org/results.cfm';
var ACM_REFERENCE_URL = 'https://dl.acm.org/exportformats.cfm';
var SCHOLAR_SEARCH_URL = 'https://scholar.google.com/scholar';
var IEEE_SEARCH_URL = 'http://ieeexplore.ieee.org/rest/search';
var IEEE_REFERENCE_URL = 'http://ieeexplore.ieee.org/xpl/downloadCitations';

var sources = {
    GSCHOLAR: 'GOOGLE_SCHOLAR',
    ACM: 'ACM',
    IEEE: 'IEEE'
};

exports.retrieve = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(source, id) {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.t0 = source;
                        _context7.next = _context7.t0 === sources.ACM ? 3 : _context7.t0 === sources.IEEE ? 5 : _context7.t0 === sources.GSCHOLAR ? 7 : 9;
                        break;

                    case 3:
                        console.log(' retrieving with ACM');
                        return _context7.abrupt("return", retrieveAcm(id));

                    case 5:
                        console.log(' retrieving with IEEE');
                        return _context7.abrupt("return", retrieveIeee(id));

                    case 7:
                        console.log(' retrieving with google scholar');
                        return _context7.abrupt("return", retrieveScholar(id));

                    case 9:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    function retrieve(_x7, _x8) {
        return _ref8.apply(this, arguments);
    }

    return retrieve;
}();

/**
 * Searches the given source for a list of articles.
 */
exports.search = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(source, query) {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.t0 = source;
                        _context8.next = _context8.t0 === sources.ACM ? 3 : _context8.t0 === sources.IEEE ? 5 : _context8.t0 === sources.GSCHOLAR ? 7 : 9;
                        break;

                    case 3:
                        console.log(' using ACM');
                        return _context8.abrupt("return", searchAcm(query));

                    case 5:
                        console.log(' using IEEE');
                        return _context8.abrupt("return", searchIeee(query));

                    case 7:
                        // make google scholar default
                        console.log(" using google scholar <gscholar>");
                        return _context8.abrupt("return", searchScholar(query));

                    case 9:
                        throw Error("no result is found");

                    case 10:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    function search(_x9, _x10) {
        return _ref9.apply(this, arguments);
    }

    return search;
}();

/**
 * Supported paper sources.
 */
exports.sources = sources;