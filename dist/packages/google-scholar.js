'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

/*
{ title: 'Quantifying the loss of compress–forward relaying without Wyner–Ziv coding',
    url: 'http://ieeexplore.ieee.org/abstract/document/4802323/',
    authors: [ [Object], [Object], [Object], [Object] ],
    description: '… Abstract—The compress-and-forward (CF) strategy achieves the optimal diversity–multiplexing\ntradeoff (DMT) of a three-node half-duplex relay network in slow fading, under�… For multiplexing\ngains r 2 3, this loss can be fully compensated for by using power control at the relay�… \n',
    citedCount: 0,
    citedUrl: 'https://scholar.google.comjavascript:void(0)',
    relatedUrl: '',
    pdfUrl: 'https://pdfs.semanticscholar.org/831c/f8dacbe5e9f6d368427c4e14316e429a34b5.pdf' },
* */

var search_n = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query, limit) {
        var results, r;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        results = [];
                        _context.next = 3;
                        return search(query);

                    case 3:
                        r = _context.sent;

                        results.push.apply(results, (0, _toConsumableArray3.default)(r.results));

                    case 5:
                        if (!(results.length < limit || r.results.length === 0)) {
                            _context.next = 14;
                            break;
                        }

                        _context.next = 8;
                        return sleep(2000);

                    case 8:
                        _context.next = 10;
                        return r.next();

                    case 10:
                        r = _context.sent;

                        results.push.apply(results, (0, _toConsumableArray3.default)(r.results));
                        _context.next = 5;
                        break;

                    case 14:
                        return _context.abrupt('return', (0, _extends3.default)({}, r, {
                            count: results.length,
                            results: results
                        }));

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function search_n(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');
var cheerio = require('cheerio');
var stripTags = require('striptags');

// todo: add throttling
// https://developers.google.com/webmaster-tools/search-console-api-original/v3/limits
var RATE_LIMITS = { S: 5, M: 200, D: 1e8 };

var RESULTS_PER_PAGE = 10;
var USER_AGENT = 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7';
var GOOGLE_SCHOLAR_URL = 'https://scholar.google.com/scholar?hl=en&q=';
var GOOGLE_SCHOLAR_URL_PREFIX = 'https://scholar.google.com';

var ELLIPSIS_HTML_ENTITY = '&#x2026;';
var ET_AL_NAME = 'et al.';
var CITATION_COUNT_PREFIX = 'Cited by ';
var RELATED_ARTICLES_PREFIX = 'Related articles';

var ROBOT_PAGE = "Please show you&#39;re not a robot";
var BOT_ECODE = "ERR_DETECTED_AS_BOT";
var STATUS_CODE_FOR_RATE_LIMIT = 503;
var STATUS_MESSAGE_FOR_RATE_LIMIT = 'Service Unavailable';
var STATUS_MESSAGE_BODY = 'This page appears when Google automatically detects requests coming from your computer network which appear to be in violation of the <a href="//www.google.com/policies/terms/">Terms of Service</a>. The block will expire shortly after those requests stop.';

// regex with thanks to http://stackoverflow.com/a/5917250/1449799
var RESULT_COUNT_RE = /\W*((\d+|\d{1,3}(,\d{3})*)(\.\d+)?) results/;

function scholarResultsCallback(resolve, reject) {
    return function (error, response, html) {
        if (error) {
            reject(error);
        } else if (html.match(ROBOT_PAGE)) {
            var err = new Error('You are detected as a robot');
            err.code = BOT_ECODE;
            reject(err);
        } else if (response.statusCode !== 200) {
            if (response.statusCode === STATUS_CODE_FOR_RATE_LIMIT && response.statusMessage === STATUS_MESSAGE_FOR_RATE_LIMIT && response.body.indexOf(STATUS_MESSAGE_BODY) > -1) {
                reject(new Error('you are being rate-limited by google. you have made too many requests too quickly. see: https://support.google.com/websearch/answer/86640'));
            } else {
                reject(new Error('expected statusCode 200 on http response, but got: ' + response.statusCode));
            }
        } else {
            var $ = cheerio.load(html);

            var results = $('.gs_r');
            var resultCount = 0;
            var nextUrl = '';
            var prevUrl = '';
            if ($('.gs_ico_nav_next').parent().attr('href')) {
                nextUrl = GOOGLE_SCHOLAR_URL_PREFIX + $('.gs_ico_nav_next').parent().attr('href');
            }
            if ($('.gs_ico_nav_previous').parent().attr('href')) {
                prevUrl = GOOGLE_SCHOLAR_URL_PREFIX + $('.gs_ico_nav_previous').parent().attr('href');
            }

            var processedResults = [];
            results.each(function (i, r) {
                $(r).find('.gs_ri h3 span').remove();
                var title = $(r).find('.gs_ri h3').text().trim();
                var url = $(r).find('.gs_ri h3 a').attr('href');
                var authorsString = $(r).find('.gs_ri .gs_a').text();

                var _authorsString$split$ = authorsString.split('- ').map(function (s) {
                    return s.trim();
                }),
                    _authorsString$split$2 = (0, _slicedToArray3.default)(_authorsString$split$, 3),
                    authors = _authorsString$split$2[0],
                    journalYear = _authorsString$split$2[1],
                    website = _authorsString$split$2[2];

                var _journalYear$split = journalYear.split(','),
                    _journalYear$split2 = (0, _slicedToArray3.default)(_journalYear$split, 2),
                    journal = _journalYear$split2[0],
                    year = _journalYear$split2[1];

                authors = authors.split(', ').map(function (a) {
                    return { name: a };
                });
                // let authors = $(r).find('.gs_ri .gs_a a').map((i, e) => ({
                //     name: e.children[0].data,
                //     url: e.attribs.href || ""
                // }));
                var description = $(r).find('.gs_ri .gs_rs').text();
                var footerLinks = $(r).find('.gs_ri .gs_fl a');
                var citedCount = 0;
                var citedUrl = '';
                var relatedUrl = '';
                var pdfUrl = $($(r).find('.gs_ggsd a')[0]).attr('href');

                if ($(footerLinks[0]).text().indexOf(CITATION_COUNT_PREFIX) >= 0) {
                    citedCount = $(footerLinks[0]).text().substr(CITATION_COUNT_PREFIX.length);
                }
                if ($(footerLinks[0]).attr && $(footerLinks[0]).attr('href') && $(footerLinks[0]).attr('href').length > 0) {
                    citedUrl = GOOGLE_SCHOLAR_URL_PREFIX + $(footerLinks[0]).attr('href');
                }
                if (footerLinks && footerLinks.length && footerLinks.length > 0) {
                    if ($(footerLinks[0]).text && $(footerLinks[0]).text().indexOf(CITATION_COUNT_PREFIX) >= 0) {
                        citedCount = $(footerLinks[0]).text().substr(CITATION_COUNT_PREFIX.length);
                    }

                    if ($(footerLinks[1]).text && $(footerLinks[1]).text().indexOf(RELATED_ARTICLES_PREFIX) >= 0 && $(footerLinks[1]).attr && $(footerLinks[1]).attr('href') && $(footerLinks[1]).attr('href').length > 0) {
                        relatedUrl = GOOGLE_SCHOLAR_URL_PREFIX + $(footerLinks[1]).attr('href');
                    }
                }

                processedResults.push({
                    title: title,
                    year: year,
                    url: url,
                    authors: authors,
                    description: description,
                    citedCount: citedCount,
                    citedUrl: citedUrl,
                    relatedUrl: relatedUrl,
                    pdfUrl: pdfUrl
                });
            });

            var resultsCountString = $('#gs_ab_md').text();
            if (resultsCountString && resultsCountString.trim().length > 0) {
                var matches = RESULT_COUNT_RE.exec(resultsCountString);
                if (matches && matches.length > 0) {
                    resultCount = parseInt(matches[1].replace(/,/g, ''));
                } else {
                    resultCount = processedResults.length;
                }
            } else {
                resultCount = processedResults.length;
            }

            resolve({
                results: processedResults,
                count: resultCount,
                nextUrl: nextUrl,
                prevUrl: prevUrl,
                next: function next() {
                    return new _promise2.default(function (resolve, reject) {
                        if (!nextUrl) reject(new Error('At the end of search.'));
                        request({
                            headers: { 'User-Agent': USER_AGENT },
                            jar: true, url: nextUrl
                        }, scholarResultsCallback(resolve, reject));
                    });
                },
                previous: function previous() {
                    return new _promise2.default(function (resolve, reject) {
                        if (!prevUrl) reject(new Error('At the begining of search, can not go back further.'));
                        request({
                            headers: { 'User-Agent': USER_AGENT },
                            jar: true, url: prevUrl
                        }, scholarResultsCallback(resolve, reject));
                    });
                }
            });
        }
    };
}

function search(query) {
    return new _promise2.default(function (resolve, reject) {
        request({
            headers: { 'User-Agent': USER_AGENT },
            jar: true,
            url: encodeURI(GOOGLE_SCHOLAR_URL + query)
        }, scholarResultsCallback(resolve, reject));
    });
}

function sleep(ms) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function all(query) {
    return search(query).then(function (resultsObj) {
        //  eg n=111 but i have 10 already so 101 remain,
        var remainingResultsCount = resultsObj.count - resultsObj.results.length;
        if (remainingResultsCount > 0) {
            //  pr = 10
            var pagesRemaining = remainingResultsCount / RESULTS_PER_PAGE;
            var pageNumbers = [];
            for (var i = 1; i <= pagesRemaining + 1; i++) {
                pageNumbers.push(i);
            }
            return _promise2.default.all(pageNumbers.map(function (i) {
                return search(query + '&start=' + i * RESULTS_PER_PAGE).then(function (laterPagesResultsObj) {
                    return laterPagesResultsObj.results;
                });
            })).then(function (remainingResultsArr) {
                resultsObj.results = resultsObj.results.concat(remainingResultsArr.reduce(function (a, b) {
                    return a.concat(b);
                }));
                resultsObj.nextUrl = null;
                resultsObj.next = null;
                resultsObj.prevUrl = null;
                resultsObj.prev = null;
                return resultsObj;
            });
        }
    });
}

module.exports = {
    search: search,
    search_n: search_n,
    all: all
};