"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProjectConfig = exports.GlobalConfig = exports.Index = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Index = exports.Index = function () {
    function Index() {
        (0, _classCallCheck3.default)(this, Index);
    }

    (0, _createClass3.default)(Index, [{
        key: "addItem",
        value: function addItem(bibItem) {
            this.push(bibItem);
        }
    }]);
    return Index;
}();

var GlobalConfig = exports.GlobalConfig = function GlobalConfig() {
    (0, _classCallCheck3.default)(this, GlobalConfig);
};

var ProjectConfig = exports.ProjectConfig = function ProjectConfig() {
    (0, _classCallCheck3.default)(this, ProjectConfig);
};