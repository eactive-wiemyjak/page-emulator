const express = require('express');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const app = express();
const compression = require('compression');
const url = require('./url');
const { URL } = require('url');

const port = process.env.port || 3456;

const parsedUrl = new URL(url);
const origin = parsedUrl.origin;
const path = parsedUrl.pathname;

const serveCritical = process.argv.includes('critical');
const serveLazy = process.argv.includes('lazy');
const noScript = process.argv.includes('noscript');
const noImg = process.argv.includes('noimg');

app.use(compression());

const { document } = new JSDOM(
    fs.readFileSync(
        `./public${path}${
            path.endsWith('/')
                ? serveCritical
                    ? '/index-critical.html'
                    : '/index.html'
                : ''
        }`
    )
).window;

if (noScript)
    document.querySelectorAll('script').forEach((script) => script.remove());

document.querySelectorAll('a,link,img,script,source').forEach((element) => {
    if (!element.src && !element.href) return;
    if (element.src) {
        const elUrl = new URL(element.src, origin);
        if (elUrl.origin !== origin) return;
        elUrl.host = '127.0.0.1';
        elUrl.port = port;
        elUrl.protocol = 'http:';
        element.src = elUrl.href;
    } else {
        const elUrl = new URL(element.href, origin);
        if (elUrl.origin !== origin) return;
        elUrl.host = '127.0.0.1';
        elUrl.port = port;
        elUrl.protocol = 'http:';
        element.href = elUrl.href;
    }
});

if (serveLazy)
    document
        .querySelectorAll('img')
        .forEach((img) => img.setAttribute('loading', 'lazy'));

const out = document.documentElement.innerHTML;

if (noImg)
    app.get(/.*\.(jpe?g|png|webp|bmp|gif|svg)/, (req, res) => {
        res.send('');
    });

app.get(path, (req, res) => {
    res.send(out);
});

app.use(express.static('public'));

app.listen(port, () => console.log(`http://127.0.0.1:${port}${path}`));
