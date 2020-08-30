const shell = require('shelljs');
const mdjson = require('md-2-json');
const p = require('path');
const fs = require('fs');

const docrepo = 'https://github.com/ct-js/docs.ctjs.rocks.git';
const docpath = 'ctjs_docs';

// Path searching utilities
shell.cd(p.join(__dirname, docpath))
// https://stackoverflow.com/a/47492545/13825612
const isDirectory = path => fs.statSync(path).isDirectory();
const getDirectories = path =>
    fs.readdirSync(path).map(name => p.join(path, name)).filter(isDirectory);

const isMarkdown = path => path.endsWith('.md');
const getFiles = path =>
    fs.readdirSync(path).map(name => p.join(path, name)).filter(isMarkdown);

const getFilesRecursively = (path) => {
    let dirs = getDirectories(path);
    let files = dirs
        .map(dir => getFilesRecursively(dir))
        .reduce((a, b) => a.concat(b), []);
    return files.concat(getFiles(path));
};

module.exports = {
    clone() {
        // Clone repo
        shell.cd(__dirname);

        // Have we already cloned the repo?
        if (!fs.existsSync(docpath)) {
            try {
                shell.exec(`git clone ${docrepo} ctjs_docs`);
            } catch (err) {
                // Whoops something bad happened
                console.log(err)
            }
        } else {
            // Update the repo
            shell.cd(p.join(__dirname, docpath))
            shell.exec('git fetch origin master');
            shell.exec('git pull origin master');
        }
    },
    // Returns all markdown files' names with converted objects
    parse() {
        const mdFiles = getFilesRecursively('docs');

        // Create index
        let index = new Map();
        for (file of mdFiles) {
            index.set(file, mdjson.parse(fs.readFileSync(file, 'utf-8')));
        }
        return index = Object.fromEntries(index);
    },
    query(docs, term) {
        // TODO: Get documentation based off term
    },
    listTopics() {
        let keys = new Array();
        for (key in obj.keys) {
            keys.push(key);
        }
        return keys;
    }
}