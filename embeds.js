const { Message } = require('discord.js');

const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    info(color, title, description, footer) {
        return new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(description)
            .setFooter(footer);
    },
    doc(color, title, description, link) {
        return new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(description)
            .addField('Read More..', link);
    },
};
