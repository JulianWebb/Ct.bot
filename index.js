const Discord = require('discord.js');
const parser = require('yargs-parser');
const msgs = require('./messages.json');
const logger = require('./logger.js');
module.exports.logger = logger;

process.argv.splice(0, 2);
const args_ = parser(process.argv);
module.exports.args = args_;

const config = require('./utils.js').Config;
const wlConfig = require('./utils.js').WLConfig;
const msg = require('./messageHandler');
module.exports.config = config;
module.exports.wlConfig = wlConfig;

logger.saveToLog = true; // Change this to false if you don't want saved logs
const token = process.env.token || require('./credentials.json').token;

const CommandHandler = require('./handlers/CommandHandler.js');

const client = new Discord.Client();
if (args_.prefix) client.prefix = args_.prefix;
else client.prefix = config.data.prefix;
client.commands = CommandHandler.register();
client.aliases = CommandHandler.registerAliases(client.commands);

client.on('ready', () => {
    logger.info(`[Ct.bot started at ${new Date()}]`);
    logger.success('Online!');
    client.user.setActivity('Online!');
    setTimeout(() => {
        client.user.setActivity(config.data.status);
        if (args_.prefix) client.prefix = args_.prefix;
        else client.prefix = config.data.prefix;
    }, 5000);
});

client.on('message', (message) => {
    // Don't allow bots to trigger commands or non-command messages
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (client.commands.has(command)) {
        if (message.channel.type === 'dm') return message.reply('Guild-only command.');

        client.commands.get(command).run(message, args);
    } else if (client.aliases.has(command)) {
        if (message.channel.type === 'dm') return message.reply('Guild-only command.');

        client.aliases.get(command).run(message, args);
    } else {
        message.reply({
            embed: {
                title: 'Invalid Command',
                description: msg.get('errors.invalid_command', { command: `\`${config.data.prefix}help\`` }),
                footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                color: 'YELLOW',
            },
        });
    }
});

client.login(token);
