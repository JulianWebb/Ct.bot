const config = require('../../index.js').config.data;
const whitelist = require('../../index.js').wlConfig;
const messages = require('../../messages.json');

module.exports = {
    name: 'embed',
    description: 'Create embeds',
    usage: `${config.prefix}embed [embed json]`,
    admin_only: true,
    run(message, args) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || 
            whitelist.data.administrators.includes(message.member.id))) return message.reply(
                {
                    embed: {
                        title: 'No Permissions',
                        description: messages.errors.no_permissions,
                        color: 'RED'
                    }
                }
            )
        if (args.length > 0) {
            const embed = args.join(' ');
            try {
                const embedJson = JSON.parse(embed);
            } catch(e) {
                return message.reply({ embed: 
                    {
                        title: 'Invalid JSON',
                        description: 'Invalid embed json.',
                        color: 'RED'
                    }
                }).then((msg) => msg.delete({timeout:5000}))
            }
            return message.channel.send({embed:embedJson})
        }
    }
}