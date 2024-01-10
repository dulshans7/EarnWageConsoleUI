
export function testpdfex() {
    (async function () {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.page;
            await page.setContent('<h1>hello world</h1>');
            await page.emulateMedia('screen');
            await page.pdf({
                path: 'mypdf.pdf',
                format: 'A4',
                printBackground: true
            });
            console.log('done');
            await browser.close();
            process.exit();
        } catch (e) {
            console.log('our error', e);
        }
    })();
}

    export function nametest() {
        const name = 'dula'
        console.log('name', name)
    }

import { SurveyPDF } from "survey-pdf";

export const savePdf = function (surveyData) {
    console.log('surveyData', surveyData)
    const pdfDocOptions = {
        fontSize: 12
    };
    const surveyPdf = new SurveyPDF(surveyData,pdfDocOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
};