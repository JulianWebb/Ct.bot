const Discord = require('discord.js');
const logger = require('./logger.js');
const docs = require('./docs.js');
const config = require('./utils.js').Config;
const wlConfig = require('./utils.js').WL_Config;
module.exports.logger = logger;
module.exports.config = config;
module.exports.wlConfig = wlConfig;

logger.saveToLog = true; // Change this to false if you don't want saved logs
const token = config.data.token;

const CommandHandler = require('./handlers/CommandHandler.js');

const client = new Discord.Client();
client.prefix = config.data.prefix;
client.commands = CommandHandler.register(client);

client.on('ready', () => {
    logger.info(
        `[Ct.bot v${
            require('./package.json').version
        } started at ${new Date()}]`,
    );
    logger.success('Online!');
    client.user.setActivity('Online!');
    setTimeout(() => client.user.setActivity(config.data.status), 5000);
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
