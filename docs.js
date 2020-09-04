const logger = require('./index.js').logger;
const GithubApi = require('fetch-github-api');
const fetch = require('node-fetch');
const Markdown = require('@dimerapp/markdown');

const ROOT_ENDPOINT = '/repos/ct-js/docs.ctjs.rocks/contents/docs';

module.exports = {
    getUrls() {
        const data = new GithubApi(ROOT_ENDPOINT);
        return data.fetchJson();
    },
    // Returns all markdown files' converted objects
    async parse() {
        const pages = await this.getUrls();
        const promises = pages
          .filter(page => page.download_url && page.download_url.endsWith('.md'))
          .map(page =>
            fetch(page.download_url)
            .then(data => data.text())
            .then(text => new Markdown(text).toJSON())
          );
        return Promise.all(promises);
      }
};
