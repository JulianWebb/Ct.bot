const { WebhookClient } = require('discord.js');
const { logger, config, wlConfig } = require('../../index.js');

module.exports = {
    name: 'move',
    description: 'Moves messages to a different channel',
    usage: `${config.data.prefix}move [amount] [channel]`,
    aliases: ['mt', 'moveto'],
    adminOnly: true,
    async run(message, args) {
        if (message.member.permissions.has('ADMINISTRATOR') || wlConfig.data.administrators.includes(message.member.id)) {
            let amount = Number.parseInt(args[0]) + 1;
            if ((!amount) || (typeof amount != "number"))
                return message.channel.send({
                    embed: {
                        title: 'Error',
                        description: 'Please supply a valid amount',
                        footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                        color: 'RED',
                    },
                });
            if (amount >= 100) amount = 100;

            if (!(1 in args)) {
                return message.channel.send({
                    embed: {
                        title: 'Error',
                        description: 'Missing channel argument',
                        footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                        color: 'RED',
                    },
                });
            }
            const channel_id = args[1].replace(/\D/g, '');
            const channel = message.guild.channels.cache.get(channel_id);
            if (channel) {
                message.channel.messages.fetch({ limit: amount }).then((messages) => {
                    channel.createWebhook('moveCommand').then(webhook => {
                        console.log(webhook);
                        await messages.forEach(oldMessage => {
                            if (oldMessage.id == message.id) return;
                            webhook.send(oldMessage.content, { 
                                embeds: oldMessage.embeds, 
                                username: oldMessage.author.username,
                                avatar: oldMessage.author.displayAvatarURL({ dynamic: true }),
                            }).then(() => { oldMessage.delete(); }).catch(console.error);
                        });

                        //webhook.delete();
                        message.delete();
                    }).catch(console.error);
                })
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
