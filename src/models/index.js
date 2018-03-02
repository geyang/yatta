export type bibType = {
    id: string,
    updated: string,
    published: string,
    year: string,
    month: string, // month is 0-11
    title: string,
    summary: string,
    links: string,
    url: string,
    pdfUrl: string, //pick the last one.
    authors: string,
    categories: string
};

export type indexType = {
    dir: string,
    search: {}
}

export class Index {
    addItem(bibItem: bibType) {
        this.push(bibItem);
    }
}

export class GlobalConfig {

}

export class ProjectConfig {

}