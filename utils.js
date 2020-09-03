const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const WL_PATH = path.join(__dirname, 'wl.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');

if (!fs.existsSync(WL_PATH)) {
    fs.writeFileSync(WL_PATH, JSON.stringify({ administrators: [] }));
}

if (!fs.existsSync(CONFIG_PATH)) {
    console.log(chalk.bold.redBright('[ERROR]'), 'config.json does not exist! Please create it, with the correct info!');
}

class BaseConfig {
    constructor(path_) {
        this.path = path_;
        this.data = require(path_);
        this.save();
    }

    save() {
        fs.writeFileSync(this.path, `${JSON.stringify(this.data, null, '    ')}\n`);
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

    removeAdmin(id) {
        // https://stackoverflow.com/a/5767357
        const index = this.data.administrators.indexOf(id);
        this.data.administrators.pop(index);
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

    wlConfig,
    ConfigJSON,

    WLConfig: new wlConfig(),
    Config: new ConfigJSON(),
    generateConfig() {
        fs.writeFileSync(
            this.CONFIG_PATH,
            JSON.stringify({
                prefix: 'ct!',
                status: 'with ct.js! | ct!help',
            }),
        );
    },
};
