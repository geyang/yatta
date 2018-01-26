import fs from "fs-extra";
import path from "path";
import moment from "moment";

/*
// console.log(files)
// CreationDate: 'D:20150708090345+02\'00\'',
// ModDate: 'D:20150708090345+02\'00\'',
(D:YYYYMMDDHHmmSSOHH'mm')

where

YYYY is the year
MM is the month
DD is the day (01-31)
HH is the hour (00-23)
mm is the minute (00-59)
SS is the second (00-59)
O is the relationship of local time to Universal Time (UT), denoted by one of the characters +, -, or Z (see below)
HH followed by ' is the absolute value of the offset from UT in hours (00-23)
mm followed by ' is the absolute value of the offset from UT in minutes (00-59)*/

const PDF_DATE_FORMAT = "YYYYMMDDHHmmSSOHH'mm'";

// let example = "D:20150708090345+02'00'";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// example = "D:20150708090345";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// example = "";
// console.log(moment(example.slice(2), PDF_DATE_FORMAT));
// let m = moment(example, PDF_DATE_FORMAT);
// console.log(m.isValid());

function pdfDate(pdfDateStr = "") {
    return !pdfDateStr
        ? moment("", PDF_DATE_FORMAT)
        : moment(pdfDateStr.slice(2), PDF_DATE_FORMAT);
}

function info2meta(m) {
    const {info} = m;
    let dateCreated = pdfDate(info.CreationDate);
    let dateModified = pdfDate(info.ModDate);
    return {
        title: info.Title,
        authors: (info.Author || "").split(',').map(a => a.trim()),
        keywords: (info.Keywords || "").split(',').map(a => a.trim()),
        dateCreated: dateCreated.format(),
        year: dateCreated.get('year'),
        month: dateCreated.get('month'),
        dateModified: dateModified.format()
    };
}

async function getContent(pdf) {
    const numPages = pdf.pdfInfo.numPages;
    const content = [];
    for (let j = 1; j <= numPages; j++) {
        const page = await pdf.getPage(j);
        let text = await page.getTextContent();
        content.push(text.items.map(s => s.str).join('\n'))
    }
    // Wait for all pages and join text
    return content;
}

export async function readPdf(pdfPath) {
    //Step 4:turn array buffer into typed array
    const data = await fs.readFile(pdfPath);
    const tArray = new Uint8Array(data);
    const pdf = await PDFJS.getDocument(tArray);
    const meta = await pdf.getMetadata();
    const content = await getContent(pdf);
    // fs.writeFileSync(pdfPath.replace('.pdf', ".md"), content);
    // fs.removeSync(pdfPath.replace('.pdf', ".md"));
    return {
        filename: path.basename(pdfPath) || pdfPath,
        meta: info2meta(meta),
        content
    };
}

export function listFiles(path) {
    return fs.readdirSync(path);
}