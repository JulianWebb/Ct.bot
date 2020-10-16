const { logger, config, wlConfig } = require('../../index.js');

module.exports = {
    name: 'move',
    description: 'Moves messages to a different channel',
    usage: `${config.data.prefix}move [amount] [channel]`,
    aliases: ['mt', 'moveto'],
    adminOnly: true,
    run(message, args) {
        console.log('works');
        if (message.member.permissions.has('ADMINISTRATOR') || wlConfig.data.administrators.includes(message.member.id)) {
            console.log('works 2');
            let amount = Number.parseInt(args[0]);
            let channel_id = message.content.replace(/\D/g, '');
            message.channel.send(channel_id)
            if (!amount)
                return message.channel.send({
                    embed: {
                        title: 'Error',
                        description: 'Please supply a valid amount',
                        footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                        color: 'RED',
                    }
                });

        if (amount + 1 >= 100) amount = 99;
        const channel = message.guild.channels.cache.get(channel_id);
        if (channel) {

            message.fetchMessages({ limit: amount })
                .then(messages => {
                    messages.forEach(msg => {
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
            message.channel.bulkDelete(Math.abs(amount + 1)).then((messages) => {
                message.react('👌');
            });
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
        })
    }
}};
