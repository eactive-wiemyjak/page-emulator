const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const url = require('./url');

async function download(url) {
    const list = [];
    try {
        const baseUrlParsed = new URL(url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('response', async (res) => {
            const urlParsed = new URL(res.url());
            if (!res.ok()) return;
            if (!urlParsed.protocol.match(/^https?:$/)) return;
            if (baseUrlParsed.origin !== urlParsed.origin) return;
            const fullPath = urlParsed.pathname.slice(1).split('/');
            const fileName = fullPath[fullPath.length - 1].match('.')
                ? fullPath[fullPath.length - 1]
                : 'index.html';
            const pathToFileArray = fullPath[fullPath.length - 1].match('.')
                ? fullPath.slice(0, -1)
                : [...fullPath];

            const pathToFile = path.join('public', ...pathToFileArray);
            const filePath = path.join(pathToFile, fileName);

            if (!fs.existsSync(pathToFile))
                fs.mkdirSync(pathToFile, { recursive: true });

            fs.writeFileSync(filePath, await res.buffer());
        });

        await page.emulate(puppeteer.devices['Galaxy S5']);

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForTimeout(15000);

        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        await page.waitForTimeout(15000);
        await page.close();
        await browser.close();
    } catch (err) {
        console.error(err);
        return false;
    }
}

(async () => {
    await download(url);
})();

module.exports = url;
