"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var search = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query, options) {
        var spinner, results, choices, exit, prompt, _ref2, selection, i, selected, fn;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        exit = function exit(ch, key) {
                            if (key && EXIT_KEYS.indexOf(key.name) === -1) return;
                            prompt.ui.close();
                            console.log(chalk.green("\nExit on <" + key.name + "> key~"));
                            process.stdin.removeListener('keypress', exit); // complete unnecessary LOL
                        };

                        if (!(!options || !options.limit)) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt("return", console.log(chalk.red('INTERNAL_ERROR: options.limit is not specified')));

                    case 3:
                        spinner = ora("searching google scholar for " + chalk.green(query)).start();
                        _context.next = 6;
                        return model.search(query, { limit: options.limit });

                    case 6:
                        results = _context.sent;
                        choices = results.map(_utils.simple);

                        spinner.stop();

                        prompt = inquirer.prompt((0, _extends3.default)({}, search_prompt, {
                            name: "selection",
                            choices: choices
                        }));


                        process.stdin.on('keypress', exit);
                        _context.next = 13;
                        return prompt;

                    case 13:
                        _ref2 = _context.sent;
                        selection = _ref2.selection;
                        i = choices.indexOf(selection);
                        selected = results[i];
                        fn = (0, _utils.url2fn)(selected.pdfUrl);

                        try {
                            (0, _utils.curl)(selected.pdfUrl, fn);
                            console.log(chalk.green("✓"), "pdf file is saved");
                        } catch (e) {
                            console.log(chalk.red("✘"), "pdf file saving failed due to", e);
                        }
                        try {
                            selected.files = [].concat((0, _toConsumableArray3.default)(selected.files || []), [fn]);
                            // appendFileSync(".yatta.json", JSON.stringify(results[i]));
                            (0, _utils.update_index)(".yatta.yml", selected);
                            console.log(chalk.green("✓"), "bib entry attached");
                        } catch (e) {
                            console.log(chalk.red("✘"), "failed to append bib entry due to", e);
                        }

                        // prompt = inquirer.prompt({
                        //     ...search_prompt,
                        //     message: "",
                        //     name: "selection",
                        //     items: []
                        // })

                    case 20:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function search(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _utils = require("./utils");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ora = require("ora");
var chalk = require('chalk');
var program = require('commander');
var package_config = require('../package.json');
var inquirer = require('inquirer');

var _require = require('rxjs'),
    Subject = _require.Subject;

var model = require('./model');

// take a look at: https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs

var EXIT_KEYS = ["escape", "q"];

var ENTRIE_LIMIT = 15;
var search_prompt = {
    message: "Search result from Google Scholar",
    type: "list",
    default: 0,
    pageSize: ENTRIE_LIMIT + 2
};

program.version(package_config.version).option('-d, --directory', 'the directory to apply yatta. Default to ').option('-R, --recursive', 'flag to apply yatta recursively');

program.command('search [query] [options...]').option('--limit', "limit for the number of results to show on each search", parseInt, ENTRIE_LIMIT).action(search);
program.parse(process.argv);