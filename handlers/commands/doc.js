const docs = require('../../docs.js');
const { config } = require('../../index.js');

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    usage: `${config.data.prefix}doc [search terms]`,
    adminOnly: false,
    run(message, args) {
        docs.getDocs().then((docs) => {
            Promise.all(docs).then((data) => {
                data.forEach(docObject => {
                    docObject.then((doc) => {
                        if (doc.type === 'file' && doc.name.endsWith('.md')) {
                            message.channel.send(doc.download_url)
                        }
                    })
                })
            })
        })
    },
};
