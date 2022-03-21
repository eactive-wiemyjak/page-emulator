const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
    mode: 'production',
    entry: './public/static/v7d953a4b/imei/js/bundle.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    plugins: [
        new ProvidePlugin({
            $: './jquery.js',
            jQuery: './jquery.js'
        })
    ]
};
