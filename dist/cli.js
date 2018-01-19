#!/usr/bin/env node


/** Created by ge on 1/18/18. */
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var main = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var query, source, symbol, spinner, articles, questions, _ref3, article, reference, fn;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        query = cli.input.join(' ');
                        source = cli.flags.source.toUpperCase();

                        if (!query) cli.showHelp();
                        if (!sources[source]) {
                            symbol = chalk.yellow('⚠');

                            console.log(symbol + ' Valid sources are: ' + validSources);
                            process.exit(1);
                        }

                        spinner = ora('Searching for \'' + query + '\'').start();
                        articles = void 0;
                        _context.prev = 6;
                        _context.next = 9;
                        return search(source, query);

                    case 9:
                        articles = _context.sent;

                        articles = articles.slice(0, MAX_ARTICLES);
                        spinner.stop();
                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](6);

                        spinner.fail('Something went wrong while searching: ' + _context.t0);
                        process.exit(1);

                    case 18:

                        if (!articles.length) {
                            spinner.info('No results found for query \'' + query + '\'.');
                            process.exit(0);
                        }

                        questions = buildQuestions(articles);
                        _context.next = 22;
                        return inquirer.prompt(questions);

                    case 22:
                        _ref3 = _context.sent;
                        article = _ref3.article;


                        spinner.start('Retrieving BibTeX reference');
                        reference = void 0;
                        _context.prev = 26;
                        _context.next = 29;
                        return retrieve(source, article);

                    case 29:
                        reference = _context.sent;
                        _context.next = 36;
                        break;

                    case 32:
                        _context.prev = 32;
                        _context.t1 = _context['catch'](26);

                        spinner.fail('Something went wrong while retrieving reference: ' + _context.t1);
                        process.exit(1);

                    case 36:

                        spinner.stop();
                        console.log(reference);
                        try {
                            fn = "./yatta.bib";

                            fs.appendFileSync(fn, reference);
                            spinner.succeed('Written to file ', fn);
                            clipboardy.writeSync(reference);
                            spinner.succeed('Copied to clipboard!');
                        } catch (_e) {
                            console.log(_e);
                            // Ignore clipboard related errors - we've already
                            // printed the reference nonetheless.
                        }

                    case 39:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[6, 14], [26, 32]]);
    }));

    return function main() {
        return _ref2.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meow = require('meow');
var ora = require('ora');
var chalk = require('chalk');
var clipboardy = require('clipboardy');
var inquirer = require('inquirer');
var fs = require("fs");

var _require = require('./helper'),
    retrieve = _require.retrieve,
    search = _require.search,
    sources = _require.sources;

var MAX_ARTICLES = 10;
var validSources = (0, _keys2.default)(sources).map(function (s) {
    return s.toLowerCase();
}).join(', ');

var cli = meow('\n  Usage:\n    $ yatta <query>\n\n  Options:\n    --source, -s Where to find papers from (default: acm) - valid options: [' + validSources + ']\n\n  Examples:\n    $ yatta bayou\n    $ yatta --source google zaharia spark\n', {
    flags: {
        source: {
            type: 'string',
            default: "gscholar",
            alias: 's'
        }
    }
});

function buildQuestions(articles) {
    var choices = articles.map(function (_ref, i) {
        var id = _ref.id,
            title = _ref.title,
            authors = _ref.authors;
        return {
            value: id,
            name: title + ' ' + chalk.dim('(' + authors + ')')
        };
    });

    return [{
        choices: choices,
        pageSize: Infinity,
        type: 'list',
        name: 'article',
        message: 'Which article are you looking for?'
    }];
}

main();