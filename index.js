const shell = require('shelljs');
const mdjson = require('md-2-json');
const fs = require('fs');
const p = require('path');
const glob = require('glob');
const Discord = require('discord.js');

const docrepo = 'https://github.com/ct-js/docs.ctjs.rocks.git';
const docpath = 'ctjs_docs';
// Clone repo
shell.cd(__dirname);

if (!fs.existsSync(docpath)) {
    try {
        shell.exec(`git clone ${docrepo} ctjs_docs`);
    } catch(err) {
        console.log(err)
    }
} else {
    shell.cd(p.join(__dirname, docpath))
    shell.exec('git fetch origin master');
    shell.exec('git pull origin master');
}

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
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(path));
};

const mdFiles = getFilesRecursively('docs');

// Create index
let index = new Map();
for (file of mdFiles) {
    index.set(file, mdjson.parse(fs.readFileSync(file, 'utf-8')));
}
index = Object.fromEntries(index);
console.log(index)