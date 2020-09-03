const { config } = require('../../index.js');

module.exports = {
    name: 'help',
    description: 'Displays usage for all commands or specific ones',
    usage: `${config.data.prefix}help [command]`,
    adminOnly: false,
    run(message, args) {
        const commands = message.client.commands;
        if (!(args.length > 0)) {
            const help_embed = {
                color: 'BLUE',
                title: 'Help',
                description: `All help commands`,
                fields: [],
                timestamp: new Date(),
                footer: {
                    text: `Requested by ${message.member.displayName}`,
                    icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                    }),
                },
            };
            commands.forEach((command) => {
                help_embed.fields.push({
                    name: `💠 ${config.data.prefix}${command.name}`,
                    value: `\`\`\`${command.description}\`\`\``,
                    inline: false,
                });
            });
            return message.channel.send({ embed: help_embed });
        }
        if (args.length > 0) {
            const cmd = args[0].toLowerCase();
            if (commands.get(cmd)) {
                const command = commands.get(cmd);
                const help_embed = {
                    color: 'BLUE',
                    title: `🔹 ${command.name.toUpperCase()} 🔹`,
                    description: `\`\`\`${command.description}\`\`\``,
                    fields: [
                        {
                            name: 'Usage',
                            value: `\`\`\`${command.usage}\`\`\``,
                        },
                        {
                            name: 'Admins only?',
                            value: `\`\`\`${command.adminOnly}\`\`\``,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Requested by ${message.member.displayName}`,
                        icon_url: message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                };
                return message.channel.send({ embed: help_embed });
            } else {
                const error_embed = {
                    title: 'Invalid Command',
                    color: 'RED',
                    description: msgs.commands.help.invalid_command.replace('{command}', `\`${config.data.prefix}help\``),
                    timestamp: new Date(),
                    footer: {
                        text: `Requested by ${message.member.displayName}`,
                        icon_url: message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                };
                return message.reply({
                    embed: error_embed,
                });
            }
        }
    },
};
