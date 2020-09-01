const Embeds = require('../../embeds.js');
const fetch = require('node-fetch');
const { logger, config } = require('../../index.js');

const COLORMIND_URL = 'http://colormind.io/api/';

module.exports = {
    name: 'generate',
    description: 'Useful game art generation utilities',
    usage: `${config.data.prefix}generate [type]`,
    adminOnly: false,
    async run(message, args) {
        if (args[0]) {
            if (args[0] === 'pallet') {
                const data = JSON.stringify({model: 'default'});
                const res = await fetch(COLORMIND_URL, { method: 'POST', body: data });
                const json = await res.json();
                await message.reply(JSON.stringify(json));
            }
        }
    }
};
