const config = require('../../index.js').config.data;
const whitelist = require('../../index.js').wlConfig;
const messages = require('../../messages.json');
const parser = require('yargs-parser');
const { Message } = require('discord.js');

const announcement = (message = new Message(), args_) => {
    if (!(message.member.permissions.has('ADMINISTRATOR') || whitelist.data.administrators.includes(message.member.id)))
        return message.reply({
            embed: {
                title: 'No Permissions',
                description: messages.errors.no_permissions,
                color: 'RED',
            },
        });

    const embed = {
        footer: { text: `Announced by ${message.member.displayName || message.member.user.username}` },
        title: 'Ct.js Announcement',
        color: '#446ADB',
    };
    const args = parser(args_);
    if (args.title) embed.title = args.title;

    return message.channel.send({ embed });
};

module.exports = {
    name: 'embed',
    description: 'Create embeds',
    usage: `${config.prefix}embed [embed json|announcement] <if announcement: arguments>`,
    adminOnly: true,
    run(message, args) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || whitelist.data.administrators.includes(message.member.id)))
            return message.reply({
                embed: {
                    title: 'No Permissions',
                    description: messages.errors.no_permissions,
                    color: 'RED',
                },
            });

        if (args[0] === 'announcement') return announcement(message, args);

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
