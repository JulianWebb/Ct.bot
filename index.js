const Discord = require('discord.js');
const docs = require('./docs.js');

// Initialize documentation
docs.clone();
// Serialize it
const documentation = docs.parse();

const client = new Discord.Client();

