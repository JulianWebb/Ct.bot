const fs = require('fs');
const path = require('path');
const Collection = require('discord.js').Collection;
const { logger } = require('../index.js');

module.exports = {
    register(client) {
        const commandFilesDir = path.join(__dirname, 'commands');
        const commands = new Collection();

        const commandFiles = fs
            .readdirSync(commandFilesDir)
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${commandFilesDir}/${file}`);
            commands.set(command.name, command);
            logger.info(`Registered command: ${command.name}`);
        }
        return commands;
    },
};
