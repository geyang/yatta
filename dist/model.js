"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var search = exports.search = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var r;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _googleScholar2.default.search_n(query, options.limit || N_RESULTS);

                    case 2:
                        r = _context.sent;
                        return _context.abrupt("return", r.results);

                    case 4:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function search(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _googleScholar = require("./packages/google-scholar");

var _googleScholar2 = _interopRequireDefault(_googleScholar);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Created by ge on 1/19/18. */
var N_RESULTS = 20;