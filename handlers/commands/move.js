const { logger, config, wlConfig } = require('../../index.js');

module.exports = {
    name: 'move',
    description: 'Moves messages to a different channel',
    usage: `${config.data.prefix}move [amount] [channel]`,
    aliases: ['mt', 'moveto'],
    adminOnly: true,
    run(message, args) {
        if (message.member.permissions.has('ADMINISTRATOR') || wlConfig.data.administrators.includes(message.member.id)) {
            let amount = Number.parseInt(args[0]);
            const channel_id = args[1].replace(/\D/g, '');
            message.channel.messages.fetch(channel_id);
            if (!amount)
                return message.channel.send({
                    embed: {
                        title: 'Error',
                        description: 'Please supply a valid amount',
                        footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                        color: 'RED',
                    },
                });

            amount++;
            if (amount >= 100) amount = 100;
            const channel = message.guild.channels.cache.get(channel_id);
            if (channel) {
                message.channel.messages.fetch({ limit: amount }).then((messages) => {
                    messages.forEach((msg) => {
                        channel.send({
                            embed: {
                                color: 0x0099ff,
                                author: {
                                    name: msg.author.username,
                                    icon_url: msg.author.displayAvatarURL({ dynamic: true }),
                                },
                                description: msg.content,
                            },
                        });
                    });
                });
                try {
                    message.channel.bulkDelete(Math.abs(amount + 1)).then((messages) => {
                        message.channel.send('👌');
                    });
                } catch (e) {
                    message.channel.send('❗ Could not delete old messages!');
                }
            } else {
                return message.channel.send('No such channel exists!');
            }
        } else {
            return message.reply({
                embed: {
                    title: 'Error',
                    color: 'RED',
                    description: 'You do not have permission to use this command!',
                },
            });
        }
    },
};
