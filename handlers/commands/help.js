const { config } = require('../../index.js');

module.exports = {
    name: 'help',
    description: 'Displays usage for all commands or specific ones',
    usage: `${config.data.prefix}help [command]`,
    adminOnly: false,
    run(message, args) {
        const commands = message.client.commands;
        if (!(args.length > 0)) {
            const helpEmbed = {
                color: 'BLUE',
                title: 'Help',
                description: `All help commands. Run \`${config.data.prefix}help [command]\` for command usage and other info.`,
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
                helpEmbed.fields.push({
                    name: `💠 ${config.data.prefix}${command.name}`,
                    value: `\`\`\`${command.description}\`\`\``,
                    inline: false,
                });
            });
            return message.channel.send({ embed: helpEmbed });
        }
        if (args.length > 0) {
            const cmd = args[0].toLowerCase();
            if (commands.get(cmd)) {
                const command = commands.get(cmd);
                const helpEmbed = {
                    color: 'BLUE',
                    title: `🔷 ${command.name.toUpperCase()} 🔷`,
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
                return message.channel.send({ embed: helpEmbed });
            } else {
                const errorEmbed = {
                    title: 'Invalid Command',
                    color: 'RED',
                    description: msg.get('errors.invalid_command', { command: `\`${config.data.prefix}help\`` }),
                    timestamp: new Date(),
                    footer: {
                        text: `Requested by ${message.member.displayName}`,
                        icon_url: message.author.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                };
                return message.reply({
                    embed: errorEmbed,
                });
            }
        }
    },
};
