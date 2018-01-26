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

                        // return content promise
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

    return function getContent(_x) {
        return _ref.apply(this, arguments);
    };
}();

var readPdf = exports.readPdf = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path) {
        var data, tArray, pdf, meta, content;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _fsExtra2.default.readFile(path);

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

    return function readPdf(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

exports.listFiles = listFiles;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info2meta(m) {
    var info = m.info;

    return {
        title: info.Title,
        authors: (info.Author || "").split(',').map(function (a) {
            return a.trim();
        }),
        keywords: (info.Keywords || "").split(',').map(function (a) {
            return a.trim();
        })
    };
}

function listFiles(path) {
    var files = _fsExtra2.default.readdirSync(path);
    return files;
}