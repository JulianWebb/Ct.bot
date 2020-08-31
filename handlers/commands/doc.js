const Embeds = require('../../embeds.js');
const getTopics = require('../../docs.js').getTopics;

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    run(message, args) {
        console.log(message.client.docs);
    }
};
