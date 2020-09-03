const logger = require('./index.js').logger;
const axios = require('axios');

const indexUrl = 'https://api.github.com/repos/ct-js/docs.ctjs.rocks/contents/docs';

module.exports = {
    getIndex() {
        return new Promise((resolve, reject) => {
            axios.get(indexUrl).then((res) => {
                const data = res.data;
                resolve({
                    index: data,
                }).catch(reject);
            });
        })
    },
    // Returns all markdown files' names with converted objects
    parse() { }
};
