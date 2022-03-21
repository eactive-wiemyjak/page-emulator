const critical = require('critical');

critical.generate({
    inline: true,
    base: 'public/phonedatabase/phones-vivo',
    src: 'index.html',
    target: 'index-critical.html',
    width: 360,
    height: 640
});
