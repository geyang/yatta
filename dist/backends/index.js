"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEARCH_PAGES = exports.NAMES = exports.SOURCES = exports.GOOGLE_SCHOLAR = exports.ARXIV = undefined;

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _SOURCES, _NAMES, _SEARCH_PAGES; /** Created by ge on 1/20/18. */


var _arxiv = require("./arxiv");

var arxiv = _interopRequireWildcard(_arxiv);

var _googleScholar = require("./google-scholar");

var googleScholar = _interopRequireWildcard(_googleScholar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ARXIV = exports.ARXIV = "arxiv";
var GOOGLE_SCHOLAR = exports.GOOGLE_SCHOLAR = "google-scholar";
var SOURCES = exports.SOURCES = (_SOURCES = {}, (0, _defineProperty3.default)(_SOURCES, GOOGLE_SCHOLAR, googleScholar.search), (0, _defineProperty3.default)(_SOURCES, ARXIV, arxiv.search), _SOURCES);
var NAMES = exports.NAMES = (_NAMES = {}, (0, _defineProperty3.default)(_NAMES, GOOGLE_SCHOLAR, "Google Scholar"), (0, _defineProperty3.default)(_NAMES, ARXIV, "Arxiv.org"), _NAMES);
var SEARCH_PAGES = exports.SEARCH_PAGES = (_SEARCH_PAGES = {}, (0, _defineProperty3.default)(_SEARCH_PAGES, GOOGLE_SCHOLAR, googleScholar.search_page), (0, _defineProperty3.default)(_SEARCH_PAGES, ARXIV, arxiv.search_page), _SEARCH_PAGES);