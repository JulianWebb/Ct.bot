const fs = require('fs');
const path = require('path');

const WL_PATH = path.join(__dirname, 'wl.json');

module.exports = {
    init() {
        if (!fs.existsSync(WL_PATH)) {
            fs.writeFileSync(WL_PATH, JSON.stringify({administrators: []}));
        }
    },
    load() {
        return JSON.parse(fs.readFileSync(WL_PATH), 'utf-8');
    },
    add(id) {
        const data = this.load();
        data.administrator.push(id);
        fs.writeFileSync(WL_PATH, JSON.stringify(data));
    }
}