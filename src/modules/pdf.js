import fs from "fs-extra";

function info2meta(m) {
    const {info} = m;
    return {
        title: info.Title,
        authors: (info.Author || "").split(',').map(a => a.trim()),
        keywords: (info.Keywords || "").split(',').map(a => a.trim())
    }
}

async function getContent(pdf) {
    const numPages = pdf.pdfInfo.numPages;
    const content = [];
    for (let j = 1; j <= numPages; j++) {
        const page = await pdf.getPage(j);
        let text = await page.getTextContent();
        // return content promise
        content.push(text.items.map(s => s.str).join('\n'))
    }
    // Wait for all pages and join text
    return content;
}

export async function readPdf(path) {
    //Step 4:turn array buffer into typed array
    const data = await fs.readFile(path);
    const tArray = new Uint8Array(data);
    const pdf = await PDFJS.getDocument(tArray);
    const meta = await pdf.getMetadata();
    const content = await getContent(pdf);
    return {
        meta: info2meta(meta),
        content,
    };
}

export function listFiles(path) {
    const files = fs.readdirSync(path);
    return files;
}