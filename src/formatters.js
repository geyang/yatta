import chalk from "chalk";

export function full({year, month, title, authors, filename}) {
    authors = authors.filter(a => !!a.trim());
    const hasAuthor = !!(authors && authors.length);
    const firstAuthor = hasAuthor ? authors[0] : "NA";
    return !!(title && hasAuthor)
        ? `${chalk.gray(year + (month ? ("00" + month).slice(-2) : ""))}-${chalk.green(
            firstAuthor)}-${title} ${chalk.gray(filename)}`
        : `${chalk.gray(year + ("00" + month).slice(-2))}-${filename}`;
}

export function $aus(authors) {
    const first_author = authors[0];
    if (authors.length > 1) {
        return chalk.green(first_author.name) + chalk.gray(", et.al.")
    } else {
        return chalk.green(first_author.name)
    }
}

export function simple({year, title, authors, pdf}, i) {
    return `${i}. ${chalk.gray(year)} ${chalk.green($aus(authors))}, ${title}`
}