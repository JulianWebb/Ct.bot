const shell = require('shelljs');
const glob = require('glob');
const p = require('path');

const fs = require('fs-extra');
const getHeadings = require('markdown-headings');

const logger = require('./index.js').logger;

const docrepo = 'https://github.com/ct-js/docs.ctjs.rocks.git';
const docpath = 'ctjs_docs';

// Path searching utilities
shell.cd(p.join(__dirname, docpath));
// https://stackoverflow.com/a/47492545/13825612
const isDirectory = (path) => fs.statSync(path).isDirectory();
const getDirectories = (path) =>
    fs
        .readdirSync(path)
        .map((name) => p.join(path, name))
        .filter(isDirectory);

const isMarkdown = (path) => path.endsWith('.md');
const getFiles = (path) =>
    fs
        .readdirSync(path)
        .map((name) => p.join(path, name))
        .filter(isMarkdown);

const getFilesRecursively = (path) => {
    const dirs = getDirectories(path);
    const files = dirs.map((dir) => getFilesRecursively(dir)).reduce((a, b) => a.concat(b), []);
    return files.concat(getFiles(path));
};

module.exports = {
    clone() {
        // Clone repo
        shell.cd(__dirname);
        // Have we already cloned the repo?
        if (!fs.existsSync(docpath)) {
            try {
                shell.exec(`git clone ${docrepo} ${docpath}`);
                shell.cd(`${docpath}/docs`);
                shell.ls('-d', '.').forEach((dir) => {
                    if (!['.vuepress', 'images'].includes(dir)) {
                        shelljs.rm(dir);
                        logger.info(`Removed dir: ${dir}`);
                    }
                });
            } catch (err) {
                // Whoops something bad happened
                logger.warn(`There was an error retrieving the documentation from ${docrepo}`);
            }
        } else {
            // Update the repo
            shell.cd(p.join(__dirname, docpath));
            shell.exec('git fetch origin master');
            shell.exec('git pull origin master');
        }
    },
    // Returns all markdown files' names with converted objects
    async parse() {
        const mdFiles = getFilesRecursively(p.join(__dirname, docpath));
        // Create index
        const index = {};
        let rawFiles = [];
        const filenames = [];
        for (const file of mdFiles) {
            const mdFilename = file.split('\\').slice(-1)[0].slice(0, -3);
            filenames.push(mdFilename);
            rawFiles.push(fs.readFile(file, 'utf-8'));
        }
        rawFiles = await Promise.all(rawFiles);
        for (let i = 0, l = rawFiles.length; i < l; i++) {
            const headings = getHeadings(rawFiles[i]),
                filename = filenames[i],
                title = headings[0].replace(/^#+\s?/, '');
            index[filename] = { headings, filename, title };
        }
        return index;
    },
    query(docs, term) {
        // TODO: Get documentation based off term
    },
    getTopics(docs) {
        // TODO: Get all topics and return an array
    },
};
