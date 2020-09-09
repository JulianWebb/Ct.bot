const links = require('../../resources.json').links;
const { config } = require('../../index.js');

module.exports = {
    name: 'links',
    description: 'All ct.js related links',
    usage: `${config.data.prefix}links <optional: link type>`,
    aliases: ['link', 'l'],
    adminOnly: false,
    run(message, args) {
        if (args[0]) {
            // Really just awful code, please make better - Splushy
            const type = args[0].split('.')[0];
            let title = args[0][0].toUpperCase() + args[0].slice(1, args[0].length);
            if (args[0] === 'itch') {
                title = 'Itch.io';
            }
            if (Object.keys(links).includes(type)) {
                const linkEmbed = {
                    color: 'AQUA',
                    title,
                    fields: [
                        {
                            name: 'Link',
                            value: links[type],
                        },
                    ],
                };
                return message.reply({ embed: linkEmbed });
            }
        }

        const linkEmbed = {
            color: 'AQUA',
            title: 'Ct.js Links & Resources',
            fields: [
                {
                    name: 'Website',
                    value: links.website,
                },
                {
                    name: 'Documentation',
                    value: links.documentation,
                },
                {
                    name: 'Github',
                    value: links.github,
                },
                {
                    name: 'Itch.io',
                    value: links.itch,
                },
                {
                    name: 'Discord Invite',
                    value: links.discord,
                },
                {
                    name: 'Twitter',
                    value: links.twitter,
                },
                {
                    name: 'Patreon',
                    value: links.patreon,
                },
            ],
            timestamp: new Date(),
        };

        message.channel.send({
            embed: linkEmbed,
        });
    },
};
