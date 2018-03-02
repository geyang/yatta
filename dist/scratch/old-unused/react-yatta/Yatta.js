"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _model = require("./model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Yatta = function (_Component) {
    (0, _inherits3.default)(Yatta, _Component);

    function Yatta(props) {
        (0, _classCallCheck3.default)(this, Yatta);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Yatta.__proto__ || (0, _getPrototypeOf2.default)(Yatta)).call(this, props));

        _this.state = {
            query: "",
            results: []
        };
        _this.input = _this._input.bind(_this);
        _this.submit = _this._submit.bind(_this);
        _this.search = _this._search.bind(_this);
        _this.selectItem = _this._selectItem.bind(_this);
        _this.cancel = function (_) {
            return console.log('Form canceled');
        };
        return _this;
    }

    (0, _createClass3.default)(Yatta, [{
        key: "_input",
        value: function _input(query) {}
    }, {
        key: "_submit",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query) {
                var results;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.setState({ query: query });
                                _context.next = 3;
                                return (0, _model.search)(query);

                            case 3:
                                results = _context.sent;

                                this.setState({ results: results });

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _submit(_x) {
                return _ref.apply(this, arguments);
            }

            return _submit;
        }()
    }, {
        key: "_search",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._submit(this.refs.input.value);

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _search() {
                return _ref2.apply(this, arguments);
            }

            return _search;
        }()
    }, {
        key: "_selectItem",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(item) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                console.log(item);

                            case 1:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _selectItem(_x2) {
                return _ref3.apply(this, arguments);
            }

            return _selectItem;
        }()
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            setTimeout(function () {
                return _this2.refs.input.focus();
            }, 200);
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "form",
                { keys: true, vi: true, onSubmit: this.submit, onReset: this.cancel, width: "100%", height: "100%" },
                _react2.default.createElement("textbox", { inputOnFocus: true, ref: "input", onSubmit: this.submit,
                    top: 0, height: 3, right: 10, border: { type: 'line' }, style: { border: { fg: 'white' } } }),
                _react2.default.createElement("button", { keys: true, mouse: true, right: 0, top: 0, width: 10, height: 3, onClick: this.search, border: { type: 'line' },
                    style: { border: { fg: 'white' }, hover: { fg: 'green', border: { fg: "green" } } }, content: " search" }),
                _react2.default.createElement(
                    "box",
                    { top: 4, left: 3, right: 3, height: 1 },
                    "Search Result For: " + this.state.query
                ),
                _react2.default.createElement("list", { keys: true, mouse: true, interactive: true, ref: "list",
                    top: 7, left: 3, bottom: 3, right: 3, autoPadding: true,
                    style: { selected: { bg: "lightgreen", fg: "black" }, item: { hover: { bg: "white", fg: "black" } } },
                    items: this.state.results,
                    onSelect: this.selectItem
                })
            );
        }
    }]);
    return Yatta;
}(_react.Component);

exports.default = Yatta;