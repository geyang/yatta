/** Created by ge on 1/18/18. */
const scholar = require('../packages/google-scholar');


function search() {
    scholar.search('compress and control')
        .then(resultsObj => {
            console.log(resultsObj);
        });
}

search();

