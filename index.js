const Discord = require('discord.js');
const logger = require('./logger.js');
const docs = require('./docs.js');

const config = require('./config.json');
const token = config.token;

// Initialize documentation
docs.clone();
// Serialize it
const documentation = docs.parse();

const client = new Discord.Client();
client.prefix = config.prefix;

client.on('ready', () => {
    logger.info(`[Ct.bot v${require('./package.json').version} started at ${new Date()}]`)
    logger.success('Online!');
})

client.login(token);