const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { database } = require('./database.js');
const { checkForDuplicates } = require('natures-jsutils');
const { logger, args } = require('./index.js');

const WL_PATH = path.join(__dirname, 'wl.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');

if (!fs.existsSync(WL_PATH)) {
    fs.writeFileSync(WL_PATH, JSON.stringify({ administrators: [] }));
}

if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(
        CONFIG_PATH,
        JSON.stringify({
            prefix: 'ct!',
            status: 'with ct.js! | ct!help',
        }),
    );
}

class wlConfig {
    constructor() {
        this.path = WL_PATH;
        this.data = require('./wl.json');
        database.child('wl').once('value', (snap) => {
            const value = snap.val();
            if (value === null || value === undefined) return;
            this.data = checkForDuplicates(value);
            this.save();
        });
    }

    save() {
        fs.writeFileSync(this.path, `${JSON.stringify(this.data, null, '    ')}\n`);
        database.child('wl').set(this.data);
    }

    addAdmin(id) {
        this.data.administrators.push(id);
        this.save();
    }

    removeAdmin(id) {
        // https://stackoverflow.com/a/5767357
        const index = this.data.administrators.indexOf(id);
        if (index > -1) {
            this.data.administrators.splice(index, 1);
        }
        this.save();
    }
}

class ConfigJSON {
    constructor() {
        this.path = CONFIG_PATH;
        this.data = require('./config.json');
        database.child('config').once('value', (snap) => {
            const value = snap.val();
            if (value === null || value === undefined) return;
            this.data = checkForDuplicates(value);
            this.save();
        });
    }

    save() {
        fs.writeFileSync(this.path, `${JSON.stringify(this.data, null, '    ')}\n`);
        database.child('config').set(this.data);
    }
}

module.exports = {
    WL_PATH,
    CONFIG_PATH,

    wlConfig,
    ConfigJSON,

    WLConfig: new wlConfig(),
    Config: new ConfigJSON(),
};

logger.info(`\nConfig: \`${JSON.stringify(module.exports.Config.data, null, '    ')}\`\nArguments: \`${JSON.stringify(args, null, '    ')}\`\n`);
