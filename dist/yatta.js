#!/usr/bin/env node
"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/** yatta init --index-path ".yatta" */
var init = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        var _options$indexPath, indexPath, restOpts;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _options$indexPath = options.indexPath, indexPath = _options$indexPath === undefined ? _utils.INDEX_PATH : _options$indexPath, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);

                        if (fs.existsSync(indexPath)) console.error("index file " + indexPath + " already exists.");else {
                            (0, _utils.init_index)(indexPath);
                            console.log(chalk.green("✓"), "index file " + indexPath + " is created!");
                        }
                        return _context.abrupt("return", process.exit());

                    case 3:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function init(_x) {
        return _ref.apply(this, arguments);
    };
}();

/** Setting yatta configurations
 * yatta set search.open true
 * yatta set search.limit 100
 * */


var set = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(key, value, options) {
        var _load_index, papers, rest, _options$indexPath2, indexPath, restOpts, spinner, made, index, newIndex, _papers, _rest;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!key) {
                            _load_index = (0, _utils.load_index)(indexPath), papers = _load_index.papers, rest = (0, _objectWithoutProperties3.default)(_load_index, ["papers"]);

                            console.log(rest);
                            process.exit();
                        }
                        //todo: use schema instead of this crapy hack
                        if (value === "true") value = true;else if (value === 'false') value = false;else if (value.match(/^[0-9]*(\.)[.0-9]*$/)) value = parseFloat(value);

                        if (typeof (0, _utils.dot)(_utils.DEFAULT_CONFIG, key.split('.')) === 'undefined') {
                            console.error("dot.key " + key + " does not exist in the default configuration!");
                            process.exit();
                        }
                        _options$indexPath2 = options.indexPath, indexPath = _options$indexPath2 === undefined ? _utils.INDEX_PATH : _options$indexPath2, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);
                        spinner = ora("setting " + chalk.blue(indexPath) + " file").start();

                        if (!fs.existsSync(indexPath)) {
                            spinner.fail("index file " + indexPath + " does not exist. Use yatta init to initialize the file first!");
                            process.exit();
                        }
                        if (key === 'dir') try {
                            made = fs.ensureDirSync(value);

                            if (made) spinner.succeed("Creating a new folder " + value + "!");
                        } catch (err) {
                            spinner.fail(err);
                            process.exit();
                        }
                        index = (0, _utils.load_index)(indexPath);

                        try {
                            spinner.start("updating index file " + indexPath);
                            //todo: need to add casting, s.a. "true" => true
                            newIndex = (0, _utils.dot_update)(index, key.split('.'), value);

                            (0, _utils.dump_index)(indexPath, newIndex);
                            spinner.succeed(chalk.green("✓"), "index file " + indexPath + " has been updated!");
                            _papers = newIndex.papers, _rest = (0, _objectWithoutProperties3.default)(newIndex, ["papers"]);

                            console.log(_rest);
                        } catch (err) {
                            spinner.fail(err);
                        }
                        process.exit();

                    case 10:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function set(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var list = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(options) {
        var show_list = function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var _ref6, selection;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                                    name: "selection",
                                    choices: choices
                                }));

                                process.stdin.on('keypress', exit);
                                _context4.next = 4;
                                return prompt;

                            case 4:
                                _ref6 = _context4.sent;
                                selection = _ref6.selection;

                                process.stdin.removeListener('keypress', exit);
                                return _context4.abrupt("return", selection);

                            case 8:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            return function show_list() {
                return _ref5.apply(this, arguments);
            };
        }();

        var _options$indexPath3, indexPath, restOpts, index_config, papers, dir, files, spinner, pdfs, choices, search_prompt, prompt, exit, selection, selection_index, filename;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        exit = function exit(ch, key) {
                            if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
                            prompt.ui.close();
                            console.log(chalk.green("\nExit on <" + key.name + "> key~"));
                            process.stdin.removeListener('keypress', exit);
                            process.exit();
                        };

                        // todo: add prompt to open current files
                        // todo: <rename> change file name
                        // todo: <meta> add title and authors
                        // todo: <link> with bib
                        // todo: model should include: bib:..., original filename, pdf content.
                        _options$indexPath3 = options.indexPath, indexPath = _options$indexPath3 === undefined ? _utils.INDEX_PATH : _options$indexPath3, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);
                        index_config = (0, _utils.load_index)(indexPath);
                        papers = index_config.papers || _utils.DEFAULT_CONFIG.papers;
                        dir = index_config.dir || _utils.DEFAULT_CONFIG.dir;

                        papers.map(function (p) {
                            return (0, _extends3.default)({}, p, { authors: p.authors.map(function (a) {
                                    return a.name;
                                }) });
                        }).map(_formatters.full).join('\n');
                        files = (0, _pdf.listFiles)(dir).filter(function (f) {
                            return f.match(/\.pdf$/);
                        }).map(function (f) {
                            return (0, _path.join)(dir, f);
                        });
                        spinner = ora('looking through your files...').start();
                        _context5.next = 10;
                        return _promise2.default.all(files.map(function () {
                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(f) {
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.prev = 0;
                                                _context3.next = 3;
                                                return (0, _pdf.readPdf)(f);

                                            case 3:
                                                return _context3.abrupt("return", _context3.sent);

                                            case 6:
                                                _context3.prev = 6;
                                                _context3.t0 = _context3["catch"](0);

                                                console.log(_context3.t0);

                                            case 9:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, this, [[0, 6]]);
                            }));

                            return function (_x6) {
                                return _ref4.apply(this, arguments);
                            };
                        }()));

                    case 10:
                        pdfs = _context5.sent;
                        choices = pdfs.filter(function (d) {
                            return !!d;
                        }).map(function (d) {
                            return (0, _extends3.default)({}, d, d.meta);
                        }).map(_formatters.full);

                        spinner.succeed();

                        search_prompt = {
                            message: "local files",
                            type: "list",
                            find: true,
                            default: 5,
                            pageSize: choices.length * 2 // when this is less than the real screen estate, it gets very ugly.
                            // todo: measure the actual height of the screen
                        };
                        prompt = void 0;

                    case 15:
                        if (!true) {
                            _context5.next = 25;
                            break;
                        }

                        _context5.next = 18;
                        return show_list();

                    case 18:
                        selection = _context5.sent;
                        selection_index = choices.indexOf(selection);

                        search_prompt.default = selection_index;
                        filename = files[selection_index];

                        if (filename) open(filename);
                        _context5.next = 15;
                        break;

                    case 25:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function list(_x5) {
        return _ref3.apply(this, arguments);
    };
}();

var search = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(query, options) {
        var show_list = function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var _ref10;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                                    name: "selection",
                                    choices: choices
                                }));

                                process.stdin.on('keypress', exit);
                                _context6.next = 4;
                                return prompt;

                            case 4:
                                _ref10 = _context6.sent;
                                selection = _ref10.selection;

                                process.stdin.removeListener('keypress', exit);

                            case 7:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            return function show_list() {
                return _ref9.apply(this, arguments);
            };
        }();

        var index_config, dir, search, sourceName, search_page, search_url, search_prompt, spinner, results, _ref8, choices, selection, prompt, exit, tasks;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        exit = function exit(ch, key) {
                            if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
                            prompt.ui.close();
                            console.log(chalk.green("\nExit on <" + key.name + "> key~"));
                            process.stdin.removeListener('keypress', exit);
                            process.exit();
                        };

                        index_config = (0, _utils.load_index)(options.indexPath);

                        index_config = (0, _extends3.default)({}, _utils.DEFAULT_CONFIG, index_config, {
                            search: (0, _extends3.default)({}, _utils.DEFAULT_CONFIG.search, index_config.search, options)
                        });
                        dir = index_config.dir;

                        options = index_config.search;

                        if (options.limit) {
                            _context8.next = 7;
                            break;
                        }

                        return _context8.abrupt("return", console.error(chalk.red('OPTION_ERROR: options.limit is not specified or 0')));

                    case 7:
                        // add options.backend
                        search = backends.SOURCES[options.source];
                        sourceName = backends.NAMES[options.source];
                        search_page = backends.SEARCH_PAGES[options.source];
                        search_url = backends.SEARCH_URL[options.source];

                        if (!(!search && typeof search === "function")) {
                            _context8.next = 13;
                            break;
                        }

                        return _context8.abrupt("return", console.error(chalk.red("OPTION_ERROR: options.source is not in the white list " + backends.SOURCES)));

                    case 13:
                        search_prompt = {
                            message: "Results by " + sourceName,
                            type: "checkbox",
                            find: true,
                            default: 0,
                            pageSize: options.limit * 2 // when this is less than the real screen estate, it gets very ugly.
                            // todo: measure the actual height of the screen
                        };


                        console.log("this search could be found at\n" + search_page(query));
                        console.log("api call at \n" + search_url(query));

                        spinner = ora("searching " + chalk.yellow(sourceName) + " for " + chalk.green(query.join(' '))).start();
                        results = void 0;
                        _context8.prev = 18;
                        _context8.next = 21;
                        return search(query, options.limit);

                    case 21:
                        _ref8 = _context8.sent;
                        results = _ref8.results;
                        _context8.next = 30;
                        break;

                    case 25:
                        _context8.prev = 25;
                        _context8.t0 = _context8["catch"](18);

                        spinner.stop();
                        if (_context8.t0.code === _googleScholar.ERR_BOT) console.error(chalk.green("\nYou are detected as a bot\n"), _context8.t0);else console.error(chalk.red('\nsomething went wrong during search\n'), _context8.t0);
                        process.exit();

                    case 30:
                        spinner.stop();
                        choices = results.map(_formatters.simple).slice(0, options.limit);
                        selection = void 0, prompt = void 0;

                    case 33:
                        if (!true) {
                            _context8.next = 43;
                            break;
                        }

                        _context8.next = 36;
                        return show_list();

                    case 36:
                        spinner = ora();
                        tasks = selection.map(function () {
                            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(title, index) {
                                var selected, url, authors, fn;
                                return _regenerator2.default.wrap(function _callee7$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                selected = results[choices.indexOf(title)];
                                                url = (0, _resolver.pdfResolver)(selected.url, selected.pdfUrl);

                                                if (!url) {
                                                    spinner.fail("url " + (0, _stringify2.default)(selected.url) + " and pdfUrl \"" + (0, _stringify2.default)(selected.pdfUrl) + "\" \n                    are not resolving correctly. Please feel free to email " + package_config.author);
                                                    process.exit();
                                                }
                                                // make this configurable
                                                authors = selected.authors.map(function (a) {
                                                    return a.name;
                                                });
                                                fn = (0, _path.join)(dir, (0, _jsPyformat2.default)(index_config.filename, (0, _extends3.default)({}, selected, {
                                                    YY: selected.year ? ("0" + selected.year % 100).slice(-2) : "",
                                                    MM: selected.month ? ("0" + selected.month).slice(-2) : "",
                                                    authors: authors.join(', '),
                                                    firstAuthor: authors[0] || "NA",
                                                    filename: (0, _utils.url2fn)(url)
                                                })));
                                                _context7.prev = 5;

                                                if (!fs.existsSync(fn)) {
                                                    _context7.next = 10;
                                                    break;
                                                }

                                                spinner.warn("the file " + fn + " already exists! Skipping the download.");
                                                _context7.next = 14;
                                                break;

                                            case 10:
                                                // done: download link resolution:
                                                // todo: use unified single spinner for the entire parallel task stack.
                                                spinner.start("downloading " + url + " to " + fn);
                                                _context7.next = 13;
                                                return (0, _utils.curl)(url, fn);

                                            case 13:
                                                spinner.succeed("saved at " + fn + "; " + chalk.red('If corrupted, go to:') + " " + url);

                                            case 14:
                                                if (!options.open) {
                                                    _context7.next = 19;
                                                    break;
                                                }

                                                spinner.start(chalk.green("opening the pdf file " + fn));
                                                // "You can change this setting using either\n\t1. the `-O` flag or \n\t2. the `yatta.yml` config file.");
                                                _context7.next = 18;
                                                return (0, _utils.sleep)(200);

                                            case 18:
                                                open(fn);

                                            case 19:
                                                _context7.next = 25;
                                                break;

                                            case 21:
                                                _context7.prev = 21;
                                                _context7.t0 = _context7["catch"](5);

                                                spinner.fail("failed to save " + fn + " due to");
                                                console.log(_context7.t0);

                                            case 25:
                                                try {
                                                    spinner.start("attaching bib entry");
                                                    selected.files = [].concat((0, _toConsumableArray3.default)(selected.files || []), [fn]);
                                                    (0, _utils.update_index)(options.indexPath, selected);
                                                    spinner.succeed("bib entry attached");
                                                } catch (e) {
                                                    spinner.fail("failed to append bib entry due to");
                                                    console.log(e, selected);
                                                }

                                            case 26:
                                            case "end":
                                                return _context7.stop();
                                        }
                                    }
                                }, _callee7, this, [[5, 21]]);
                            }));

                            return function (_x9, _x10) {
                                return _ref11.apply(this, arguments);
                            };
                        }());
                        _context8.next = 40;
                        return _promise2.default.all(tasks);

                    case 40:
                        spinner.stop();
                        _context8.next = 33;
                        break;

                    case 43:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, this, [[18, 25]]);
    }));

    return function search(_x7, _x8) {
        return _ref7.apply(this, arguments);
    };
}();

var _utils = require("./utils");

var _backends = require("./backends");

var backends = _interopRequireWildcard(_backends);

var _googleScholar = require("./backends/google-scholar");

var _path = require("path");

var _resolver = require("./resolver");

var _pdf = require("./modules/pdf");

var _formatters = require("./formatters");

var _jsPyformat = require("js-pyformat");

var _jsPyformat2 = _interopRequireDefault(_jsPyformat);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ora = require("ora");
var fs = require("fs-extra");
var chalk = require('chalk');
var program = require('commander');
var package_config = require('../package.json');
var inquirer = require('inquirer');

var _require = require('rxjs'),
    Subject = _require.Subject;

var open = require('opn');

// format.extend(String.prototype, {});

// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs


var EXIT_KEYS = ["escape", "q"];

program.version(package_config.version).option('-d, --directory', 'the directory to apply yatta. Default to ').option('-R, --recursive', 'flag to apply yatta recursively');

program.command('init').option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).action(init);

program.command('list').option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).action(list);

program.command('set [key.path] [value]').description("modifies the configuration file, located at " + _utils.INDEX_PATH + " by default. Use dot separated path string as the key.").option('--index-path <index path>', "path for the " + _utils.INDEX_PATH + " index file", _utils.INDEX_PATH).action(set);

program.command('search <query...>', { isDefault: true }).description("Search for papers with google-scholar and arxiv!\n\n  Examples:\n      ~> " + chalk.green('yatta search -s arxiv "compress and control" au:bellemare"') + "\n      # >> generates a query " + chalk.blue('("compress and control" AND au:bellemare)') + "\n      ~> " + chalk.green('yatta search -s arxiv electrons on helium schuster') + "\n      # >> generates a query " + chalk.blue('(schuster AND (helium AND (electrons AND on)))') + "\n      \n  We use a carefully designed parsing logic to generate the query AST for arxiv.org.\n  This is a LOT easier to use than the clunky arxiv website!")
// todo: do validation here in the spec.
.option("-s --source <" + (0, _keys2.default)(backends.SOURCES) + ">", "The search backend to use, choose among " + (0, _keys2.default)(backends.SOURCES) + ". Default is " + backends.GOOGLE_SCHOLAR, function (s) {
    return s.toLowerCase();
}).option('--limit <limit>', "limit for the number of results to show on each search. Default is " + _utils.ENTRY_LIMIT, parseInt).option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).option('-O --open', "open the downloaded pdf file").action(search);

program.parse(process.argv);