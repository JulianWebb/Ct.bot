const { logger, config } = require('../../index.js');

module.exports = {
    name: 'purge',
    description: 'Clears messages',
    usage: `${config.data.prefix}purge [amount]`,
    adminOnly: true,
    run(message, args) {
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const amount = Number.parseInt(args[0]);
            if (!amount)
                return {
                    embed: {
                        title: 'Error',
                        description: 'Please supply a valid amount',
                        footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                        color: 'RED',
                    },
                };

            message.channel.bulkDelete(amount).then((messages) => {
                logger.success(`${message.member.user.tag} successfully deleted ${messages.size} messages.`);
                message
                    .reply({
                        embed: {
                            title: 'Success',
                            description: `Deleted ${messages.size} messages.`,
                            footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                            color: 'AQUA',
                        },
                    })
                    .then((msg) => msg.delete({ timeout: 5000 }));
            });
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
