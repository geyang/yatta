/** Created by ge on 1/19/18. */
import googleScholar from "./packages/google-scholar";
import {sleep} from "./utils";

const N_RESULTS = 20;

export async function search(query, options = {}) {
    const r = await googleScholar.search_n(query, options.limit || N_RESULTS);
    return r.results;
}
