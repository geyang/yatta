'use strict';

let request = require('request');
let cheerio = require('cheerio');
let stripTags = require('striptags');

// todo: add throttling
// https://developers.google.com/webmaster-tools/search-console-api-original/v3/limits
const RATE_LIMITS = {S: 5, M: 200, D: 1e8};

const RESULTS_PER_PAGE = 10;
const USER_AGENT = 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7';
const GOOGLE_SCHOLAR_URL = 'https://scholar.google.com/scholar?hl=en&q=';
const GOOGLE_SCHOLAR_URL_PREFIX = 'https://scholar.google.com';

const ELLIPSIS_HTML_ENTITY = '&#x2026;';
const ET_AL_NAME = 'et al.';
const CITATION_COUNT_PREFIX = 'Cited by ';
const RELATED_ARTICLES_PREFIX = 'Related articles';

const ROBOT_PAGE = "Please show you&#39;re not a robot";
const BOT_ECODE = "ERR_DETECTED_AS_BOT";
const STATUS_CODE_FOR_RATE_LIMIT = 503;
const STATUS_MESSAGE_FOR_RATE_LIMIT = 'Service Unavailable';
const STATUS_MESSAGE_BODY = 'This page appears when Google automatically detects requests coming from your computer network which appear to be in violation of the <a href="//www.google.com/policies/terms/">Terms of Service</a>. The block will expire shortly after those requests stop.';

// regex with thanks to http://stackoverflow.com/a/5917250/1449799
const RESULT_COUNT_RE = /\W*((\d+|\d{1,3}(,\d{3})*)(\.\d+)?) results/;

function scholarResultsCallback(resolve, reject) {
    return function (error, response, html) {
        if (error) {
            reject(error)
        } else if (html.match(ROBOT_PAGE)) {
            const err = new Error('You are detected as a robot');
            err.code = BOT_ECODE;
            reject(err)
        } else if (response.statusCode !== 200) {
            if (response.statusCode === STATUS_CODE_FOR_RATE_LIMIT && response.statusMessage === STATUS_MESSAGE_FOR_RATE_LIMIT && response.body.indexOf(STATUS_MESSAGE_BODY) > -1) {
                reject(new Error('you are being rate-limited by google. you have made too many requests too quickly. see: https://support.google.com/websearch/answer/86640'))
            } else {
                reject(new Error('expected statusCode 200 on http response, but got: ' + response.statusCode))
            }
        } else {
            let $ = cheerio.load(html);

            let results = $('.gs_r');
            let resultCount = 0;
            let nextUrl = '';
            let prevUrl = '';
            if ($('.gs_ico_nav_next').parent().attr('href')) {
                nextUrl = GOOGLE_SCHOLAR_URL_PREFIX + $('.gs_ico_nav_next').parent().attr('href')
            }
            if ($('.gs_ico_nav_previous').parent().attr('href')) {
                prevUrl = GOOGLE_SCHOLAR_URL_PREFIX + $('.gs_ico_nav_previous').parent().attr('href')
            }

            let processedResults = [];
            results.each((i, r) => {
                $(r).find('.gs_ri h3 span').remove();
                let title = $(r).find('.gs_ri h3').text().trim();
                let url = $(r).find('.gs_ri h3 a').attr('href');
                let authorNamesHTMLString = $(r).find('.gs_ri .gs_a').html();
                let etAl = false;
                let etAlBegin = false;
                let authors = [];
                let description = $(r).find('.gs_ri .gs_rs').text();
                let footerLinks = $(r).find('.gs_ri .gs_fl a');
                let citedCount = 0;
                let citedUrl = '';
                let relatedUrl = '';
                let pdfUrl = $($(r).find('.gs_ggsd a')[0]).attr('href');

                if ($(footerLinks[0]).text().indexOf(CITATION_COUNT_PREFIX) >= 0) {
                    citedCount = $(footerLinks[0]).text().substr(CITATION_COUNT_PREFIX.length)
                }
                if ($(footerLinks[0]).attr &&
                    $(footerLinks[0]).attr('href') &&
                    $(footerLinks[0]).attr('href').length > 0) {
                    citedUrl = GOOGLE_SCHOLAR_URL_PREFIX + $(footerLinks[0]).attr('href')
                }
                if (footerLinks &&
                    footerLinks.length &&
                    footerLinks.length > 0) {
                    if ($(footerLinks[0]).text &&
                        $(footerLinks[0]).text().indexOf(CITATION_COUNT_PREFIX) >= 0) {
                        citedCount = $(footerLinks[0]).text().substr(CITATION_COUNT_PREFIX.length)
                    }

                    if ($(footerLinks[1]).text &&
                        $(footerLinks[1]).text().indexOf(RELATED_ARTICLES_PREFIX) >= 0 &&
                        $(footerLinks[1]).attr &&
                        $(footerLinks[1]).attr('href') &&
                        $(footerLinks[1]).attr('href').length > 0) {
                        relatedUrl = GOOGLE_SCHOLAR_URL_PREFIX + $(footerLinks[1]).attr('href')
                    }
                }
                if (authorNamesHTMLString) {
                    let cleanString = authorNamesHTMLString.substr(0, authorNamesHTMLString.indexOf(' - '));
                    if (cleanString.substr(cleanString.length - ELLIPSIS_HTML_ENTITY.length) === ELLIPSIS_HTML_ENTITY) {
                        etAl = true;
                        cleanString = cleanString.substr(0, cleanString.length - ELLIPSIS_HTML_ENTITY.length)
                    }
                    if (cleanString.substr(0, ELLIPSIS_HTML_ENTITY.length) === ELLIPSIS_HTML_ENTITY) {
                        etAlBegin = true;
                        cleanString = cleanString.substr(ELLIPSIS_HTML_ENTITY.length + 2)
                    }
                    let htmlAuthorNames = cleanString.split(', ');
                    if (etAl) {
                        htmlAuthorNames.push(ET_AL_NAME)
                    }
                    if (etAlBegin) {
                        htmlAuthorNames.unshift(ET_AL_NAME)
                    }
                    authors = htmlAuthorNames.map(name => {
                        let tmp = cheerio.load(name);
                        let authorObj = {
                            name: '',
                            url: ''
                        };
                        if (tmp('a').length === 0) {
                            authorObj.name = stripTags(name)
                        } else {
                            authorObj.name = tmp('a').text();
                            authorObj.url = GOOGLE_SCHOLAR_URL_PREFIX + tmp('a').attr('href')
                        }
                        return authorObj
                    })
                }

                processedResults.push({
                    title: title,
                    url: url,
                    authors: authors,
                    description: description,
                    citedCount: citedCount,
                    citedUrl: citedUrl,
                    relatedUrl: relatedUrl,
                    pdfUrl: pdfUrl
                })
            });

            let resultsCountString = $('#gs_ab_md').text();
            if (resultsCountString && resultsCountString.trim().length > 0) {
                let matches = RESULT_COUNT_RE.exec(resultsCountString);
                if (matches && matches.length > 0) {
                    resultCount = parseInt(matches[1].replace(/,/g, ''))
                } else {
                    resultCount = processedResults.length
                }
            } else {
                resultCount = processedResults.length
            }

            resolve({
                results: processedResults,
                count: resultCount,
                nextUrl: nextUrl,
                prevUrl: prevUrl,
                next: function () {
                    return new Promise(function (resolve, reject) {
                        request({
                            headers: {'User-Agent': USER_AGENT},
                            jar: true, url: nextUrl
                        }, scholarResultsCallback(resolve, reject))
                    })
                },
                previous: function () {
                    return new Promise(function (resolve, reject) {
                        request({
                            headers: {'User-Agent': USER_AGENT},
                            jar: true, url: prevUrl
                        }, scholarResultsCallback(resolve, reject))
                    })
                }
            })
        }
    }
}

function search(query) {
    return new Promise(function (resolve, reject) {
        request({
            headers: {'User-Agent': USER_AGENT},
            jar: true,
            url: encodeURI(GOOGLE_SCHOLAR_URL + query)
        }, scholarResultsCallback(resolve, reject))
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function search_n(query, limit) {
    let results = [];
    let r = await search(query);
    results.push(...r.results);
    while (results.length < limit) {
        await sleep(2000);
        r = await r.next();
        results.push(...r.results)
    }
    return {
        ...r,
        count: results.length,
        results
    };
}

function all(query) {
    return search(query)
        .then(resultsObj => {
            //  eg n=111 but i have 10 already so 101 remain,
            let remainingResultsCount = resultsObj.count - resultsObj.results.length;
            if (remainingResultsCount > 0) {
                //  pr = 10
                let pagesRemaining = remainingResultsCount / RESULTS_PER_PAGE;
                let pageNumbers = [];
                for (let i = 1; i <= pagesRemaining + 1; i++) {
                    pageNumbers.push(i)
                }
                return Promise.all(pageNumbers.map(i => {
                    return search(query + '&start=' + i * RESULTS_PER_PAGE)
                        .then(laterPagesResultsObj => {
                            return laterPagesResultsObj.results
                        })
                }))
                    .then(remainingResultsArr => {
                        resultsObj.results = resultsObj.results.concat(remainingResultsArr.reduce((a, b) => a.concat(b)));
                        resultsObj.nextUrl = null;
                        resultsObj.next = null;
                        resultsObj.prevUrl = null;
                        resultsObj.prev = null;
                        return resultsObj
                    })
            }
        })
}


module.exports = {
    search: search,
    search_n: search_n,
    all: all
};
