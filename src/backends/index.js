/** Created by ge on 1/20/18. */
import * as arxiv from "./arxiv";
import * as googleScholar from "./google-scholar";

export const ARXIV = "arxiv";
export const GOOGLE_SCHOLAR = "google-scholar";
export const SOURCES = {[GOOGLE_SCHOLAR]: googleScholar.search, [ARXIV]: arxiv.search};
export const NAMES = {[GOOGLE_SCHOLAR]: "Google Scholar", [ARXIV]: "Arxiv.org"};

