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

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var init = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(_utils.RC_PATH);
                        if ((0, _utils.rc_exist)(_utils.RC_PATH)) console.error("global rc file " + _utils.RC_PATH + " already exists.");else {
                            (0, _utils.init_rc)();
                            console.log(chalk.green("✓"), "global rc file " + _utils.RC_PATH + " is created!");
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

/** yatta init --index-path ".yatta" */


var create = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        var _options$indexPath, indexPath, restOpts;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _options$indexPath = options.indexPath, indexPath = _options$indexPath === undefined ? _utils.INDEX_PATH : _options$indexPath, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);

                        if (fs.existsSync(indexPath)) console.error("index file " + indexPath + " already exists.");else {
                            (0, _utils.create_index)(indexPath);
                            console.log(chalk.green("✓"), "index file " + indexPath + " is created!");
                        }
                        return _context2.abrupt("return", process.exit());

                    case 3:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function create(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

/** Setting yatta configurations
 * yatta set search.open true
 * yatta set search.limit 100
 * */


var set = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key, value, options) {
        var restOpts, indexPath, default_conf, spinner, made, index, newIndex, papers, rest;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!key) {
                            console.log("need to supply dot separated key and update value");
                            process.exit();
                        }
                        //todo: use schema instead of this crapy hack
                        if (value === "true") value = true;else if (value === 'false') value = false;else if (value.match(/^[0-9]*(\.)[.0-9]*$/)) value = parseFloat(value);

                        restOpts = (0, _objectWithoutProperties3.default)(options, []);
                        indexPath = options.global ? _utils.RC_PATH : _utils.INDEX_PATH;
                        default_conf = options.global ? _utils.DEFAULT_RC : _utils.DEFAULT_CONFIG;
                        // console.log(indexPath);

                        if (typeof (0, _utils.dot)(default_conf, key.split('.')) === 'undefined') {
                            console.error("dot.key " + key + " does not exist in the default configuration!");
                            process.exit();
                        }
                        spinner = ora("setting " + chalk.blue(indexPath) + " file").start();

                        if (!fs.existsSync(indexPath)) {
                            spinner.fail("index file " + indexPath + " does not exist. Use yatta " + (options.global ? "init" : "create") + " to initialize the file first!");
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
                        // console.log(index);

                        try {
                            spinner.start("updating index file " + indexPath);
                            //todo: need to add casting, s.a. "true" => true
                            newIndex = (0, _utils.dot_update)(index, key.split('.'), value);

                            (0, _utils.dump)(indexPath, newIndex);
                            spinner.succeed(chalk.green("✓"), "index file " + indexPath + " has been updated!");
                            papers = newIndex.papers, rest = (0, _objectWithoutProperties3.default)(newIndex, ["papers"]);

                            console.log(rest);
                        } catch (err) {
                            spinner.fail(err);
                        }
                        process.exit();

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function set(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

var list = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(options) {
        var show_list = function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var _ref7, selection;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                                    name: "selection",
                                    choices: choices
                                }));

                                process.stdin.on('keypress', exit);
                                _context5.next = 4;
                                return prompt;

                            case 4:
                                _ref7 = _context5.sent;
                                selection = _ref7.selection;

                                process.stdin.removeListener('keypress', exit);
                                return _context5.abrupt("return", selection);

                            case 8:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            return function show_list() {
                return _ref6.apply(this, arguments);
            };
        }();

        var _options$indexPath2, indexPath, restOpts, index_config, papers, dir, files, spinner, pdfs, choices, search_prompt, prompt, exit, selection, selection_index, filename;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
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
                        _options$indexPath2 = options.indexPath, indexPath = _options$indexPath2 === undefined ? _utils.INDEX_PATH : _options$indexPath2, restOpts = (0, _objectWithoutProperties3.default)(options, ["indexPath"]);
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
                        _context6.next = 10;
                        return _promise2.default.all(files.map(function () {
                            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(f) {
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.prev = 0;
                                                _context4.next = 3;
                                                return (0, _pdf.readPdf)(f);

                                            case 3:
                                                return _context4.abrupt("return", _context4.sent);

                                            case 6:
                                                _context4.prev = 6;
                                                _context4.t0 = _context4["catch"](0);

                                                console.log(_context4.t0);

                                            case 9:
                                            case "end":
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, this, [[0, 6]]);
                            }));

                            return function (_x7) {
                                return _ref5.apply(this, arguments);
                            };
                        }()));

                    case 10:
                        pdfs = _context6.sent;
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
                            _context6.next = 25;
                            break;
                        }

                        _context6.next = 18;
                        return show_list();

                    case 18:
                        selection = _context6.sent;
                        selection_index = choices.indexOf(selection);

                        search_prompt.default = selection_index;
                        filename = files[selection_index];

                        if (filename) open(filename);
                        _context6.next = 15;
                        break;

                    case 25:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function list(_x6) {
        return _ref4.apply(this, arguments);
    };
}();

var search = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(query, options) {
        var show_list = function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                var _ref11;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                                    name: "selection",
                                    choices: choices
                                }));

                                process.stdin.on('keypress', exit);
                                _context7.next = 4;
                                return prompt;

                            case 4:
                                _ref11 = _context7.sent;
                                selection = _ref11.selection;

                                process.stdin.removeListener('keypress', exit);

                            case 7:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            return function show_list() {
                return _ref10.apply(this, arguments);
            };
        }();

        var global_config, index_config, lib_dir, dir, search, sourceName, search_page, search_url, search_prompt, spinner, results, _ref9, choices, selection, prompt, exit, tasks;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        exit = function exit(ch, key) {
                            if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
                            prompt.ui.close();
                            console.log(chalk.green("\nExit on <" + key.name + "> key~"));
                            process.stdin.removeListener('keypress', exit);
                            process.exit();
                        };

                        global_config = (0, _utils.load_index)(_utils.RC_PATH);
                        index_config = (0, _utils.load_index)(options.indexPath);

                        index_config = (0, _extends3.default)({}, _utils.DEFAULT_CONFIG, index_config, {
                            search: (0, _extends3.default)({}, _utils.DEFAULT_CONFIG.search, index_config.search, options)
                        });
                        lib_dir = global_config.lib;
                        dir = index_config.dir;

                        options = index_config.search;

                        if (options.limit) {
                            _context9.next = 9;
                            break;
                        }

                        return _context9.abrupt("return", console.error(chalk.red('OPTION_ERROR: options.limit is not specified or 0')));

                    case 9:
                        // add options.backend
                        search = backends.SOURCES[options.source];
                        sourceName = backends.NAMES[options.source];
                        search_page = backends.SEARCH_PAGES[options.source];
                        search_url = backends.SEARCH_URL[options.source];

                        if (!(!search && typeof search === "function")) {
                            _context9.next = 15;
                            break;
                        }

                        return _context9.abrupt("return", console.error(chalk.red("OPTION_ERROR: options.source is not in the white list " + backends.SOURCES)));

                    case 15:
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
                        _context9.prev = 20;
                        _context9.next = 23;
                        return search(query, options.limit);

                    case 23:
                        _ref9 = _context9.sent;
                        results = _ref9.results;
                        _context9.next = 32;
                        break;

                    case 27:
                        _context9.prev = 27;
                        _context9.t0 = _context9["catch"](20);

                        spinner.stop();
                        if (_context9.t0.code === _googleScholar.ERR_BOT) console.error(chalk.green("\nYou are detected as a bot\n"), _context9.t0);else console.error(chalk.red('\nsomething went wrong during search\n'), _context9.t0);
                        process.exit();

                    case 32:
                        spinner.stop();
                        choices = results.map(_formatters.simple).slice(0, options.limit);
                        selection = void 0, prompt = void 0;

                    case 35:
                        if (!true) {
                            _context9.next = 45;
                            break;
                        }

                        _context9.next = 38;
                        return show_list();

                    case 38:
                        spinner = ora();
                        tasks = selection.map(function () {
                            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(title, index) {
                                var selected, url, authors, fn, pdf_path, alias_path;
                                return _regenerator2.default.wrap(function _callee8$(_context8) {
                                    while (1) {
                                        switch (_context8.prev = _context8.next) {
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

                                                // create file name

                                                fn = (0, _jsPyformat2.default)(index_config.filename, (0, _extends3.default)({}, selected, {
                                                    YY: selected.year ? ("0" + selected.year % 100).slice(-2) : "",
                                                    MM: selected.month ? ("0" + selected.month).slice(-2) : "",
                                                    authors: authors.join(', '),
                                                    firstAuthor: authors[0] || "NA",
                                                    filename: (0, _utils.url2fn)(url)
                                                })).replace(/[\\/:*?"<>|]/g, "");
                                                pdf_path = (0, _path.join)(lib_dir, fn);
                                                alias_path = (0, _path.join)(dir, fn);
                                                _context8.prev = 7;

                                                if (!fs.existsSync(pdf_path)) {
                                                    _context8.next = 12;
                                                    break;
                                                }

                                                spinner.warn("the file " + fn + " already exists! Skipping the download.");
                                                _context8.next = 16;
                                                break;

                                            case 12:
                                                // done: download link resolution:
                                                // todo: use unified single spinner for the entire parallel task stack.
                                                spinner.start("downloading " + url + " to " + pdf_path);
                                                _context8.next = 15;
                                                return (0, _utils.curl)(url, pdf_path);

                                            case 15:
                                                spinner.succeed("saved at " + pdf_path + "; " + chalk.red('If corrupted, go to:') + " " + url);

                                            case 16:
                                                try {
                                                    fs.lstatSync(alias_path);
                                                    spinner.warn("the alias " + alias_path + " already exists!");
                                                    // todo: make sure that the link if connected to the correct pdf file?
                                                } catch (e) {
                                                    if (e.name === "ENOENT") {
                                                        // todo: use unified single spinner for the entire parallel task stack.
                                                        fs.ensureSymlinkSync(pdf_path, alias_path);
                                                        spinner.succeed("saved a symbolic link at " + alias_path + ";");
                                                    } else {
                                                        console.warn(e);
                                                    }
                                                }
                                                _context8.next = 23;
                                                break;

                                            case 19:
                                                _context8.prev = 19;
                                                _context8.t0 = _context8["catch"](7);

                                                spinner.fail("failed to save " + fn + " due to");
                                                console.log(_context8.t0);

                                            case 23:
                                                if (!options.open) {
                                                    _context8.next = 28;
                                                    break;
                                                }

                                                spinner.start(chalk.green("opening the pdf file " + pdf_path));
                                                // "You can change this setting using either\n\t1. the `-O` flag or \n\t2. the `yatta.yml` config file.");
                                                _context8.next = 27;
                                                return (0, _utils.sleep)(200);

                                            case 27:
                                                open(pdf_path);

                                            case 28:
                                                try {
                                                    spinner.start("attaching bib entry");
                                                    selected.files = [].concat((0, _toConsumableArray3.default)(selected.files || []), [fn]);
                                                    (0, _utils.update_index)(options.indexPath, selected);
                                                    spinner.succeed("bib entry attached");
                                                } catch (e) {
                                                    spinner.fail("failed to append bib entry due to");
                                                    console.log(e, selected);
                                                }

                                            case 29:
                                            case "end":
                                                return _context8.stop();
                                        }
                                    }
                                }, _callee8, this, [[7, 19]]);
                            }));

                            return function (_x10, _x11) {
                                return _ref12.apply(this, arguments);
                            };
                        }());
                        _context9.next = 42;
                        return _promise2.default.all(tasks);

                    case 42:
                        spinner.stop();
                        _context9.next = 35;
                        break;

                    case 45:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this, [[20, 27]]);
    }));

    return function search(_x8, _x9) {
        return _ref8.apply(this, arguments);
    };
}();

var _utils = require("./utils");

var _backends = require("./backends");

var backends = _interopRequireWildcard(_backends);

var _googleScholar = require("./backends/google-scholar");

var _path = require("path");

var _resolver = require("./scratch/old-unused/resolver");

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

program.command('create').option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).action(create);

program.command('list').option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).action(list);

program.command('set [key.path] [value]').description("modifies the configuration file, located at " + _utils.INDEX_PATH + " by default. Use dot separated path string as the key.").option('-g, --global', "flag for setting global configs")
// .option('--index-path <index path>', `path for the ${INDEX_PATH} index file`, INDEX_PATH)
.action(set);

program.command('search <query...>', { isDefault: true }).description("Search for papers with google-scholar and arxiv!\n\n  Examples:\n      ~> " + chalk.green('yatta search -s arxiv "compress and control" au:bellemare"') + "\n      # >> generates a query " + chalk.blue('("compress and control" AND au:bellemare)') + "\n      ~> " + chalk.green('yatta search -s arxiv electrons on helium schuster') + "\n      # >> generates a query " + chalk.blue('(schuster AND (helium AND (electrons AND on)))') + "\n      \n  We use a carefully designed parsing logic to generate the query AST for arxiv.org.\n  This is a LOT easier to use than the clunky arxiv website!")
// todo: do validation here in the spec.
.option("-s --source <" + (0, _keys2.default)(backends.SOURCES) + ">", "The search backend to use, choose among " + (0, _keys2.default)(backends.SOURCES) + ". Default is " + backends.GOOGLE_SCHOLAR, function (s) {
    return s.toLowerCase();
}).option('--limit <limit>', "limit for the number of results to show on each search. Default is " + _utils.ENTRY_LIMIT, parseInt).option('--index-path <index path>', "path for the yatta.yml index file", _utils.INDEX_PATH).option('-O --open', "open the downloaded pdf file").action(search);

program.parse(process.argv);