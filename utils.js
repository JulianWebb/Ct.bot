const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const WL_PATH = path.join(__dirname, 'wl.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');

if (!fs.existsSync(WL_PATH)) {
    fs.writeFileSync(WL_PATH, JSON.stringify({ administrators: [] }));
}

if (!fs.existsSync(CONFIG_PATH)) {
    console.log(
        chalk.bold.redBright('[ERROR]'),
        'config.json does not exist! Please create it, with the correct info!',
    );
}

class BaseConfig {
    constructor(path) {
        this.path = path;
        this.data = require(path);
        this.save();
    }

    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.data, null, '    '));
    }
}

class wlConfig extends BaseConfig {
    constructor() {
        try {
            // For autocomplete
            this.data = require('./wl.json');
        } catch (e) {
            const a = null;
        }
        super(WL_PATH);
    }

    addAdmin(id) {
        this.data.administrators.push(id);
        this.save();
    }
}

class ConfigJSON extends BaseConfig {
    constructor() {
        try {
            // For autocomplete
            this.data = require('./config.json');
        } catch (e) {
            const a = null;
        }
        super(CONFIG_PATH);
    }
}

module.exports = {
    WL_PATH,
    CONFIG_PATH,

    WL_Config: new wlConfig(),
    Config: new ConfigJSON(),
};
