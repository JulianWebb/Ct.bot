const { parse } = require('../../docs.js');
const docs = require('../../docs.js');
const { config } = require('../../index.js');

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    usage: `${config.data.prefix}doc [search terms]`,
    adminOnly: false,
    run(message, args) {
        docs.parse().then((parsedDocs) => {
            
            parsedDocs.forEach((doc) => {
                console.log(
                    JSON.stringify(doc.contents.children[1])
                )
            });
        })
    },
};
