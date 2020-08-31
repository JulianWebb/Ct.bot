const Embeds = require('../../embeds.js');
const links = require('../../resources.json');
const { config } = require('../../index.js');

module.exports = {
    name: 'links',
    description: 'All ct.js related links',
    usage: `${config.data.prefix}links`,
    admin_only: false,
    run(message, args) {
        const linkEmbed = {
            color: 'AQUA',
            title: 'Ct.js Links & Resources',
            image: {
                url:
                    'https://github.com/yonderbread/Ct.bot/raw/master/assets/splash.png',
            },
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
