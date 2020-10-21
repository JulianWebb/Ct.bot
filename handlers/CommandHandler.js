const fs = require('fs-extra');
const path = require('path');
const Collection = require('discord.js').Collection;
const { logger } = require('../index.js');

module.exports = {
    register(client) {
        const commandFilesDir = path.join(__dirname, 'commands');
        const commands = new Collection();

        const commandFiles = fs.readdirSync(commandFilesDir).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${commandFilesDir}/${file}`);
            if (init in command) {
                command.init(client, command);
            }
            commands.set(command.name, command);
            logger.info(`Registered command: ${command.name}`);
        }
        return commands;
    },
    registerAliases(commands) {
        const aliases = new Collection();

        commands.each((command) => {
            for (const alias of command.aliases) {
                aliases.set(alias, command);
            }
        });
        return aliases;
    },
};
