import format from "js-pyformat";


let t = "{year:.2}{month:2d}";
let f = format(t, {year: "2018", month: "3"});
console.log([f]);
f = format('{:%Y-%m-%dT%H:%M:%S}', new Date(2015, 11, 25));
console.log(f);
// "2015-12-25T00:00:00"
