const critical = require('critical');

critical.generate({
    inline: true,
    base: 'public/',
    src: 'index.html',
    target: 'index-critical.html',
    width: 360,
    height: 640
});
