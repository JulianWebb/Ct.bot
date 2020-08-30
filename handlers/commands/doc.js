const Embeds = require('../../embeds.js');
const getTopics = require('../../docs.js').getTopics;

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    run(message, args) {
        const topics = getTopics(message.client.docs).join('\n');
        const topicsEmbed = Embeds.info('BLUE', 'Available Topics', topics, 'Requested by ' + message.member.user.tag);
        message.reply(topicsEmbed);
    }
}