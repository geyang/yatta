"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _taggedTemplateLiteral2 = require("babel-runtime/helpers/taggedTemplateLiteral");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _templateObject = (0, _taggedTemplateLiteral3.default)(["Failed to read index file due to ", ""], ["Failed to read index file due to ", ""]); /** Created by ge on 1/19/18. */


exports.sleep = sleep;
exports.$aus = $aus;
exports.simple = simple;
exports.url2fn = url2fn;
exports.curl = curl;
exports.update_index = update_index;

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _url = require("url");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _jsYaml = require("js-yaml");

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sleep(ms) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function $aus(authors) {
    var first_author = authors[0];
    if (authors.length > 1) {
        return _chalk2.default.green(first_author.name) + _chalk2.default.gray(", et.al.");
    } else {
        return _chalk2.default.green(first_author.name);
    }
}

function simple(_ref, i) {
    var title = _ref.title,
        authors = _ref.authors,
        pdf = _ref.pdf;

    return i + ". " + _chalk2.default.green($aus(authors)) + ", " + title;
}

function url2fn(url) {
    var parsed = (0, _url.parse)(url);
    return _path2.default.basename(parsed.pathname);
}

var USER_AGENT = 'curl/7.52.1';
// doesn't work with arxiv
// 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7';

function curl(url, targetPath) {
    var file = _fsExtra2.default.createWriteStream(targetPath);
    url = url.replace(/^https/, "http");
    (0, _request2.default)({ url: url, headers: { 'User-Agent': USER_AGENT } }).pipe(file);
}

// curl("https://arxiv.org/pdf/1703.01988.pdf", "test.pdf");


var DEFAULT_DIR = "./";
var DEFAULT_INDEX = { dir: DEFAULT_DIR };

function update_index(indexPath, entry) {
    _fsExtra2.default.ensureFileSync(indexPath);
    var index = void 0,
        content = void 0;
    try {
        content = _fsExtra2.default.readFileSync(indexPath, 'utf8');
        if (!content) index = DEFAULT_INDEX;else {
            index = _jsYaml2.default.safeLoad(content);
            if ((typeof index === "undefined" ? "undefined" : (0, _typeof3.default)(index)) !== 'object') throw new Error("index file " + indexPath + " seems to be ill-formed.");
            _fsExtra2.default.copySync(indexPath, indexPath.trim() + ".backup", { overwrite: true });
        }
    } catch (err) {
        console.log(f(_templateObject, err));
        throw err;
    }
    // todo: use dictionary instead;
    index.papers = [].concat((0, _toConsumableArray3.default)(index.papers || []), [entry]);
    content = _jsYaml2.default.safeDump(index, { 'sortKeys': true });
    _fsExtra2.default.writeFileSync(indexPath, content);
}

// update_index(".yatta.yml", {name: "test"});