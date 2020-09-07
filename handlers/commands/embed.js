const config = require('../../index.js').config;
const whitelist = require('../../index.js').wlConfig;
const msg = require('../../messageHandler.js');
const parser = require('yargs-parser');
const { Message } = require('discord.js');

const announcement = (message = new Message(), args_) => {
    if (!(message.member.permissions.has('ADMINISTRATOR') || whitelist.data.administrators.includes(message.member.id)))
        return message.reply({
            embed: {
                title: 'No Permissions',
                description: msg.get('errors.no_permissions'),
                color: 'RED',
            },
        });

    const args = parser(args_);

    const embed = {
        footer: { text: `Announced by ${message.member.displayName || message.member.user.username}` },
        thumbnail: { url: '' },
        image: { url: '' },
        title: 'Ct.js Announcement',
        color: '#446ADB',
        timestamp: new Date(),
    };

    if (args.title) embed.title = args.title;
    if (args.description) embed.description = args.description;
    if (args.color) embed.color = args.color;
    if (args.thumbnail) embed.thumbnail.url = args.thumbnail;
    if (args.image) embed.image.url = args.image;

    // message.delete();
    return message.channel.send({ embed });
};

module.exports = {
    name: 'embed',
    description: 'Create embeds (and announcement embeds)',
    usage: `${config.data.prefix}embed [embed json|announcement] <if announcement: arguments>`,
    adminOnly: true,
    run(message, args) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || whitelist.data.administrators.includes(message.member.id)))
            return message.reply({
                embed: {
                    title: 'No Permissions',
                    description: msg.get('errors.no_permissions'),
                    color: 'RED',
                },
            });

        if (args[0] === 'announcement' || args[0] === 'announce') return announcement(message, args);

        if (args.length > 0) {
            const embed = args.join(' ');
            try {
                const embedJson = JSON.parse(embed);
                message.channel.send({ embed: embedJson });
            } catch (e) {
                return message
                    .reply({
                        embed: {
                            title: 'Invalid JSON',
                            description: 'Invalid embed json.',
                            color: 'RED',
                        },
                    })
                    .then((msg) => msg.delete({ timeout: 5000 }));
            }
            message.delete();
        }
    },
};
