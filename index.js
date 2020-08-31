const Discord = require('discord.js');
const logger = require('./logger.js');
const docs = require('./docs.js');
module.exports.logger = logger;

logger.saveToLog = true; // Change this to false if you don't want saved logs
const config = require('./config.json');
const token = config.token;

const CommandHandler = require('./handlers/CommandHandler.js');

// Initialize documentation
docs.clone();

const client = new Discord.Client();
client.prefix = config.prefix;
client.commands = CommandHandler.register(client);
client.docs = docs.parse();

client.on('ready', () => {
    logger.info(
        `[Ct.bot v${
            require('./package.json').version
        } started at ${new Date()}]`,
    );
    logger.success('Online!');
});

client.on('message', (message) => {
    // Don't allow bots to trigger commands or non-command messages
    if (!message.content.startsWith(client.prefix) || message.author.bot)
        return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (client.commands.has(command)) {
        client.commands.get(command).run(message, args);
    }
});

client.login(token);
