const Embeds = require('../../embeds.js');
const links = require('../../resources.json');

module.exports = {
    name: 'links',
    description: 'All ct.js related links',
    run(message, args) {
        const linkEmbed = {
            color: 'AQUA',
            title: 'Ct.js Links & Resources',
            image: {
                url: 'https://github.com/ct-js/ct-js/blob/develop/branding/GithubHeader.png'
            },
            fields: [
                {
                    name: 'Website',
                    value: links.website
                },
                {
                    name: 'Documentation',
                    value: links.documentation
                },
                {
                    name: 'Github',
                    value: links.github
                },
                {
                    name: 'Itch.io',
                    value: links.itch
                },
                {
                    name: 'Discord Invite',
                    value: links.discord
                },
                {
                    name: 'Twitter',
                    value: links.twitter
                },
                {
                    name: 'Patreon',
                    value: links.patreon
                }
            ],
            timestamp: new Date()
        }

        message.channel.send(
            {
                embed: linkEmbed
            }
        )
    }
}