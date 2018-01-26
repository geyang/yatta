"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readPdf = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getContent = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(pdf) {
        var numPages, content, j, page, text;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        numPages = pdf.pdfInfo.numPages;
                        content = [];
                        j = 1;

                    case 3:
                        if (!(j <= numPages)) {
                            _context.next = 14;
                            break;
                        }

                        _context.next = 6;
                        return pdf.getPage(j);

                    case 6:
                        page = _context.sent;
                        _context.next = 9;
                        return page.getTextContent();

                    case 9:
                        text = _context.sent;

                        content.push(text.items.map(function (s) {
                            return s.str;
                        }).join('\n'));

                    case 11:
                        j++;
                        _context.next = 3;
                        break;

                    case 14:
                        return _context.abrupt("return", content);

                    case 15:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getContent(_x2) {
        return _ref.apply(this, arguments);
    };
}();

var readPdf = exports.readPdf = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(pdfPath) {
        var data, tArray, pdf, meta, content;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _fsExtra2.default.readFile(pdfPath);

                    case 2:
                        data = _context2.sent;
                        tArray = new Uint8Array(data);
                        _context2.next = 6;
                        return PDFJS.getDocument(tArray);

                    case 6:
                        pdf = _context2.sent;
                        _context2.next = 9;
                        return pdf.getMetadata();

                    case 9:
                        meta = _context2.sent;
                        _context2.next = 12;
                        return getContent(pdf);

                    case 12:
                        content = _context2.sent;
                        return _context2.abrupt("return", {
                            filename: _path2.default.basename(pdfPath) || pdfPath,
                            meta: info2meta(meta),
                            content: content
                        });

                    case 14:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function readPdf(_x3) {
        return _ref2.apply(this, arguments);
    };
}();

exports.listFiles = listFiles;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
// console.log(files)
// CreationDate: 'D:20150708090345+02\'00\'',
// ModDate: 'D:20150708090345+02\'00\'',
(D:YYYYMMDDHHmmSSOHH'mm')

where

YYYY is the year
MM is the month
DD is the day (01-31)
HH is the hour (00-23)
mm is the minute (00-59)
SS is the second (00-59)
O is the relationship of local time to Universal Time (UT), denoted by one of the characters +, -, or Z (see below)
HH followed by ' is the absolute value of the offset from UT in hours (00-23)
mm followed by ' is the absolute value of the offset from UT in minutes (00-59)*/

var PDF_DATE_FORMAT = "YYYYMMDDHHmmSSOHH'mm'";

// let example = "D:20150708090345+02'00'";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// example = "D:20150708090345";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// example = "";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// let m = moment(example, PDF_DATE_FORMAT);
// console.log(m.isValid());

function pdfDate() {
    var pdfDateStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    return !pdfDateStr ? (0, _moment2.default)("", PDF_DATE_FORMAT) : (0, _moment2.default)(pdfDateStr.slice(2), PDF_DATE_FORMAT);
}

function info2meta(m) {
    var info = m.info;

    var dateCreated = pdfDate(info.CreationDate);
    var dateModified = pdfDate(info.ModDate);
    return {
        title: info.Title,
        authors: (info.Author || "").split(',').map(function (a) {
            return a.trim();
        }),
        keywords: (info.Keywords || "").split(',').map(function (a) {
            return a.trim();
        }),
        dateCreated: dateCreated.format(),
        year: dateCreated.get('year'),
        month: dateCreated.get('month'),
        dateModified: dateModified.format()
    };
}

function listFiles(path) {
    return _fsExtra2.default.readdirSync(path);
}