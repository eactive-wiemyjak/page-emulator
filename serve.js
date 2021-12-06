const express = require('express');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const app = express();
const compression = require('compression');
const url = require('./download');
const { URL } = require('url');

const port = process.env.port || 3456;

const origin = new URL(url).origin;

app.use(compression());

app.get('/', (req, res) => {
    const { document } = new JSDOM(fs.readFileSync('./public/index.html'))
        .window;

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

    res.send(document.documentElement.innerHTML);
});

app.use(express.static('public'));

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));