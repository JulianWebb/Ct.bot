const Embeds = require('../../embeds.js');
const { logger, config } = require('../../index.js');

module.exports = {
    name: 'purge',
    description: 'Clears messages',
    usage: `${config.data.prefix}purge [amount]`,
    admin_only: true,
    run(message, args) {
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const amount = Number.parseInt(args[0]);
            if (!amount)
                return Embeds.info(
                    'RED',
                    'Error',
                    'Please supply a valid amount.',
                    'Requested by ' + message.member.user.tag,
                );

            message.channel.bulkDelete(amount).then((messages) => {
                logger.success(
                    `${message.member.user.tag} successfully deleted ${messages.size} messages.`,
                );
                message.reply(
                    Embeds.info(
                        'AQUA',
                        'Success',
                        `Deleted ${messages.size} messages.`,
                        'Requested by ' + message.member.user.tag,
                    ),
                );
            });
        }
    },
};
