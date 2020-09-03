const Discord = require('discord.js');
const logger = require('./logger.js');
const config = require('./utils.js').Config;
const wlConfig = require('./utils.js').WLConfig;
const msgs = require('./messages.json');
module.exports.logger = logger;
module.exports.config = config;
module.exports.wlConfig = wlConfig;

console.log(process.env);

logger.saveToLog = true; // Change this to false if you don't want saved logs
const token = process.env.token || require('./credentials.json').token;

const CommandHandler = require('./handlers/CommandHandler.js');

const client = new Discord.Client();
client.prefix = config.data.prefix;
client.commands = CommandHandler.register(client);

client.on('ready', () => {
    logger.info(`[Ct.bot v${require('./package.json').version} started at ${new Date()}]`);
    logger.success('Online!');
    client.user.setActivity('Online!');
    setTimeout(() => {
        client.user.setActivity(config.data.status);
        client.prefix = config.data.prefix;
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
    } else {
        message.reply({
            embed: {
                title: 'Invalid Command',
                description: msgs.errors.invalid_command.replace('{command}', `\`${config.data.prefix}help\``),
                footer: { text: `Requested by ${message.member.displayName || message.member.user.username}` },
                color: 'YELLOW',
            },
        });
    }
});

client.login(token);
