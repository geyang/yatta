"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.full = full;
exports.$aus = $aus;
exports.simple = simple;

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function full(_ref) {
    var year = _ref.year,
        month = _ref.month,
        title = _ref.title,
        authors = _ref.authors,
        filename = _ref.filename;

    authors = authors.filter(function (a) {
        return !!a.trim();
    });
    var hasAuthor = !!(authors && authors.length);
    var firstAuthor = hasAuthor ? authors[0] : "NA";
    return !!(title && hasAuthor) ? _chalk2.default.gray(year + (month ? ("00" + month).slice(-2) : "")) + "-" + _chalk2.default.green(firstAuthor) + "-" + title + " " + _chalk2.default.gray(filename) : _chalk2.default.gray(year + ("00" + month).slice(-2)) + "-" + filename;
}

function $aus(authors) {
    var first_author = authors[0];
    if (authors.length > 1) {
        return _chalk2.default.green(first_author.name) + _chalk2.default.gray(", et.al.");
    } else {
        return _chalk2.default.green(first_author.name);
    }
}

function simple(_ref2, i) {
    var year = _ref2.year,
        title = _ref2.title,
        authors = _ref2.authors,
        pdf = _ref2.pdf;

    return i + ". " + _chalk2.default.gray(year) + " " + _chalk2.default.green($aus(authors)) + ", " + title;
}