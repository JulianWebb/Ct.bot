const logger = require('./index.js').logger;
const fetch = require('node-fetch');

const indexUrl = 'https://api.github.com/repos/ct-js/docs.ctjs.rocks/contents/docs';

module.exports = {
    getDocs() {
        return new Promise((resolve, reject) => {
            fetch(indexUrl, (err, res, body) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    },
    // Returns all markdown files' names with converted objects
    parse() {}
};
