'use strict';

/** Created by ge on 1/18/18. */
var scholar = require('../packages/google-scholar');

function search() {
    scholar.search('compress and control').then(function (resultsObj) {
        console.log(resultsObj);
    });
}

search();