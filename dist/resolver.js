"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pdfResolver = pdfResolver;
var APS = /^(https:\/\/journals.aps.org\/(.*))(abstract)(.*)/;

function pdfResolver(url, pdfUrl, backend) {
    if (url.match(APS)) return url.replace(APS, "$1pdf$4");
    return pdfUrl || url;
}

// let r = pdfResolver('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.107.240501');
// console.log(r);
//
// r = pdfResolver('https://journals.aps.org/pra/abstract/10.1103/PhysRevLett.107.240501');
// console.log(r);