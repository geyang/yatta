"use strict";

var _jsPyformat = require("js-pyformat");

var _jsPyformat2 = _interopRequireDefault(_jsPyformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var t = "{year:.2}{month:2d}";
var f = (0, _jsPyformat2.default)(t, { year: "2018", month: "3" });
console.log([f]);
f = (0, _jsPyformat2.default)('{:%Y-%m-%dT%H:%M:%S}', new Date(2015, 11, 25));
console.log(f);
// "2015-12-25T00:00:00"