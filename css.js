const css = require('css');
const fs = require('fs');

(async () => {
    const string = await fs.promises.readFile(
        './public/static/v7d953a4b/imei/css/main.css',
        'utf-8'
    );

    const createSelector = (fontName) =>
        css
            .parse(string)
            .stylesheet.rules.filter(
                (rule) =>
                    rule.declarations &&
                    rule.declarations.find((declaration) =>
                        declaration.value?.match(fontName)
                    )
            )
            .reduce((arr, rule) => {
                arr.push(...rule.selectors);
                return arr;
            }, [])
            .join(', ');

    const akrobatregularSelector = createSelector(/akrobatregular/i);
    const akrobatextralightSelector = createSelector(/akrobatextralight/i);
    const akrobatblackSelector = createSelector(/akrobatblack/i);
    const akrobatboldSelector = createSelector(/akrobatbold/i);

    console.log({
        akrobatregularSelector,
        akrobatextralightSelector,
        akrobatblackSelector,
        akrobatboldSelector
    });
})();
