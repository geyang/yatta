#!/usr/bin/env node
"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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
        var _options$indexPath2, indexPath, restOpts, index, newIndex;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        //todo: use schema instead of this crapy hack
                        if (value === "true") value = true;else if (value === 'false') value = false;else if (value.match(/^[0-9]*(\.)[.0-9]*$/)) value = parseFloat(value);

                        if (typeof (0, _utils.dot)(_utils.DEFAULT_CONFIG, key.split('.')) === 'undefined') {
                            console.error("dot.key " + key + " does not exist in the default configuration!");
                            process.exit();
                        }
                        _options$indexPath2 = options.indexPath, indexPath = _options$indexPath2 === undefined ? _utils.INDEX_PATH : _options$indexPath2, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);

                        if (!fs.existsSync(indexPath)) {
                            console.error("index file " + indexPath + " does not exist. Use yatta init to initialize the file first!");
                            process.exit();
                        }
                        index = (0, _utils.load_index)(indexPath);

                        try {
                            //todo: need to add casting, s.a. "true" => true
                            newIndex = (0, _utils.dot_update)(index, key.split('.'), value);

                            (0, _utils.dump_index)(indexPath, newIndex);
                            console.log(chalk.green("✓"), "index file " + indexPath + " has been updated!");
                            console.log(newIndex);
                        } catch (err) {
                            console.error(err);
                        }
                        process.exit();

                    case 7:
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
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(query, options) {
        var _options$indexPath3, indexPath, restOpts, index;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _options$indexPath3 = options.indexPath, indexPath = _options$indexPath3 === undefined ? _utils.INDEX_PATH : _options$indexPath3, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);

                        if (fs.existsSync(indexPath)) console.error("index file " + indexPath + " already exists.");else {
                            index = (0, _utils.load_index)(indexPath);

                            console.log(chalk.green("✓"), "index file " + indexPath + " is created!");
                        }
                        return _context3.abrupt("return", process.exit());

                    case 3:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function list(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var search = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(query, options) {
        var index, dir, search, sourceName, search_page, search_prompt, spinner, results, _ref5, choices, exit, prompt, _ref6, selection, tasks;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        exit = function exit(ch, key) {
                            if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
                            prompt.ui.close();
                            console.log(chalk.green("\nExit on <" + key.name + "> key~"));
                            process.stdin.removeListener('keypress', exit);
                        };

                        index = (0, _utils.load_index)(options.indexPath);
                        dir = index.dir || _utils.DEFAULT_CONFIG.dir;

                        options = (0, _extends3.default)({}, _utils.DEFAULT_CONFIG.search, index.search || {}, options);

                        if (options.limit) {
                            _context5.next = 6;
                            break;
                        }

                        return _context5.abrupt("return", console.error(chalk.red('OPTION_ERROR: options.limit is not specified or 0')));

                    case 6:
                        // add options.backend
                        search = backends.SOURCES[options.source];
                        sourceName = backends.NAMES[options.source];
                        search_page = backends.SEARCH_PAGES[options.source];

                        if (!(!search && typeof search === "function")) {
                            _context5.next = 11;
                            break;
                        }

                        return _context5.abrupt("return", console.error(chalk.red("OPTION_ERROR: options.source is not in the white list " + backends.SOURCES)));

                    case 11:
                        search_prompt = {
                            message: "Results by " + sourceName,
                            type: "checkbox",
                            default: 0,
                            pageSize: options.limit * 2 // when this is less than the real screen estate, it gets very ugly.
                            // todo: measure the actual height of the screen
                        };


                        console.log("this search could be found at\n" + search_page(query));
                        spinner = ora("searching " + chalk.yellow(sourceName) + " for " + chalk.green(query.join(' '))).start();
                        results = void 0;
                        _context5.prev = 15;
                        _context5.next = 18;
                        return search(query, options.limit);

                    case 18:
                        _ref5 = _context5.sent;
                        results = _ref5.results;
                        _context5.next = 27;
                        break;

                    case 22:
                        _context5.prev = 22;
                        _context5.t0 = _context5["catch"](15);

                        spinner.stop();
                        if (_context5.t0.code === _googleScholar.ERR_BOT) console.error(chalk.green("\nYou are detected as a bot\n"), _context5.t0);else console.error(chalk.red('\nsomething went wrong during search\n'), _context5.t0);
                        process.exit();

                    case 27:
                        spinner.stop();
                        choices = results.map(_utils.simple).slice(0, options.limit);
                        prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                            name: "selection",
                            choices: choices
                        }));


                        process.stdin.on('keypress', exit);
                        _context5.next = 33;
                        return prompt;

                    case 33:
                        _ref6 = _context5.sent;
                        selection = _ref6.selection;

                        process.stdin.removeListener('keypress', exit);

                        spinner = ora("working").start();
                        tasks = selection.map(function () {
                            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(title, index) {
                                var selected, fn;
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                selected = results[choices.indexOf(title)];

                                                if (!selected.pdfUrl) {
                                                    spinner.warn(chalk.yellow('href to PDF file does not exist with this entry.'));
                                                    spinner.info(selected);
                                                }
                                                fn = (0, _path.join)(dir, (0, _utils.url2fn)(selected.pdfUrl));
                                                _context4.prev = 3;

                                                if (!fs.existsSync(fn)) {
                                                    _context4.next = 8;
                                                    break;
                                                }

                                                spinner.warn("the file " + fn + " already exists! Skipping the download.");
                                                _context4.next = 12;
                                                break;

                                            case 8:
                                                // todo: use unified single spinner for the entire parallel task stack.
                                                spinner.info("downloading " + selected.pdfUrl + " to " + fn);
                                                _context4.next = 11;
                                                return (0, _utils.curl)(selected.pdfUrl, fn);

                                            case 11:
                                                spinner.succeed("pdf file is saved");

                                            case 12:
                                                if (!options.open) {
                                                    _context4.next = 17;
                                                    break;
                                                }

                                                spinner.info(chalk.green("opening the pdf file " + fn));
                                                // "You can change this setting using either\n\t1. the `-O` flag or \n\t2. the `yatta.yml` config file.");
                                                _context4.next = 16;
                                                return (0, _utils2.sleep)(200);

                                            case 16:
                                                open(fn);

                                            case 17:
                                                _context4.next = 23;
                                                break;

                                            case 19:
                                                _context4.prev = 19;
                                                _context4.t0 = _context4["catch"](3);

                                                spinner.fail("failed to save " + fn + " due to");
                                                console.log(_context4.t0);

                                            case 23:
                                                try {
                                                    selected.files = [].concat((0, _toConsumableArray3.default)(selected.files || []), [fn]);
                                                    (0, _utils.update_index)(options.indexPath, selected);
                                                    spinner.succeed("bib entry attached");
                                                } catch (e) {
                                                    spinner.fail("failed to append bib entry due to");
                                                    console.log(e, selected);
                                                }

                                            case 24:
                                            case "end":
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, this, [[3, 19]]);
                            }));

                            return function (_x9, _x10) {
                                return _ref7.apply(this, arguments);
                            };
                        }());
                        _context5.next = 40;
                        return _promise2.default.all(tasks);

                    case 40:
                        spinner.stop();
                        process.exit();

                    case 42:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[15, 22]]);
    }));

    return function search(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var _utils = require("./utils");

var _utils2 = require("../dist/utils");

var _backends = require("./backends");

var backends = _interopRequireWildcard(_backends);

var _googleScholar = require("./backends/google-scholar");

var _path = require("path");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ora = require("ora");
var fs = require("fs");
var chalk = require('chalk');
var program = require('commander');
var package_config = require('../package.json');
var inquirer = require('inquirer');

var _require = require('rxjs'),
    Subject = _require.Subject;

var open = require('opn');

// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs


var EXIT_KEYS = ["escape", "q"];

program.version(package_config.version).option('-d, --directory', 'the directory to apply yatta. Default to ').option('-R, --recursive', 'flag to apply yatta recursively');

program.command('init').option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH)
// we DO NOT offer config option to keep it simple
// .option('-O --open', "open the downloaded pdf file")
.action(init);

program.command('set <key.path> <value>').description("modifies the configuration file, located at " + _utils.INDEX_PATH + " by default. Use dot separated path string as the key.").option('--index-path <index path>', "path for the " + _utils.INDEX_PATH + " index file", _utils.INDEX_PATH).action(set);

program.command('search <query...>', { isDefault: true }).description('Search for papers with the specified search engine.')
// todo: do validation here in the spec.
.option("-s --source <" + (0, _keys2.default)(backends.SOURCES) + ">", "The search backend to use, choose among " + (0, _keys2.default)(backends.SOURCES) + ". Default is " + backends.GOOGLE_SCHOLAR, function (s) {
    return s.toLowerCase();
}).option('--limit <limit>', "limit for the number of results to show on each search. Default is " + _utils.ENTRY_LIMIT, parseInt).option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).option('-O --open', "open the downloaded pdf file").action(search);

program.parse(process.argv);