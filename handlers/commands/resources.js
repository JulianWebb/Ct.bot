const Embeds = require('../../embeds.js');
const links = require('../../resources.json').resources;
const { config } = require('../../index.js');

module.exports = {
    name: 'resources',
    description: 'All community resources',
    usage: `${config.data.prefix}resources`,
    adminOnly: false,
    run(message, args) {
        const linkEmbed = {
            color: 'AQUA',
            title: 'Community Resources',
            fields: [
                {
                    name: 'Texture Packer (packs multiple images into one)',
                    value: links.texturepacker,
                },
                {
                    name: 'Palette Generator',
                    value: links.palettes,
                },
                {
                    name: 'Itch.io Assets',
                    value: links.itchassets,
                },
                {
                    name: 'Kenney (assets)',
                    value: links.kenney,
                },
                {
                    name: 'Random Palette Generator',
                    value: links.randompalettes,
                },
            ],
            timestamp: new Date(),
        };

        message.channel.send({
            embed: linkEmbed,
        });
    },
};
