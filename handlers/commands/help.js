const { config } = require('../../index.js');
const msgs = require('../../messageHandler.js');

module.exports = {
    name: 'help',
    description: 'Displays usage for all commands or specific ones',
    usage: `${config.data.prefix}help [command]`,
    aliases: ['h'],
    adminOnly: false,
    run(message, args) {
        const commands = message.client.commands;
        const aliases = message.client.aliases;
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

        const cmd = args[0].toLowerCase();
        const command = aliases.get(cmd) ? commands.get(aliases.get(cmd).name) : commands.get(cmd);

        if (command) {
            const cmdAliases = command.aliases.join(', ');
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
                    {
                        name: 'Aliases',
                        value: `${cmdAliases}`,
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
                description: msgs.get('errors.invalid_command', { command: `\`${config.data.prefix}help\`` }),
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
    },
};
