/**
 * Clones docs' repo, gets files, scans for examples and headings.
 * @module
 */

/**
 * @typedef IMdFile
 * @property {string} filename The filename of the document in file system
 * @property {string} url The url of the document on docs.ctjs.rocks
 * @property {string} title The title of the document
 * @property {string} raw The contents of the document
 */

/**
 * @typedef IExample
 * @property {string} definition The definition described in the example
 * @property {string} title The title of the example
 * @property {string} pageTitle The page title
 * @property {string} lines The content of the example
 * @property {string} url The url to the page with the example
 * @property {string} hash TODO:The hash to the example
 */

/**
 * @typedef IHeadings
 * @property {Array<unknown>} headings
 * @property {string} url The url of the document
 * @property {string} title The title of the document
 */

const p = require('path'),
      fs = require('fs-extra');

const logger = require('./logger.js');

const git = require('git-pull-or-clone'),
      getHeadings = require('markdown-headings'),
      slugger = require('github-slugger');

const { Collection } = require('discord.js');

const docrepo = 'https://github.com/ct-js/docs.ctjs.rocks.git';
const docpath = 'ctjs_docs';

let gitRepoPromise;
// Here cached results are stored
let allPagesPromise,
    allExamplesPromise,
    allHeadingsPromise;
const pullRepo = () => new Promise((resolve, reject) => {
    git(docrepo, docpath, err => {
        if (err) {
            reject(err);
        } else {
            resolve(docpath);
        }
    });
});
/**
 * @async
 */
const updateDocs = async function updateDocs() {
    // Clear cached results
    // Make sure the repo is up-to-date
    logger.info(`Pulling the docs repo from ${docrepo} into ${docpath}`);
    gitRepoPromise = pullRepo();
    await gitRepoPromise;
    logger.success('Repo is up to date now 👌');
    allPagesPromise = allExamplesPromise = allHeadingsPromise = false;
};
updateDocs();
setInterval(updateDocs, 1000 * 60 * 30); // 30 minutes

/** @returns {string} */
const toDocUrl = subpath => `https://docs.ctjs.rocks/${subpath.replace('ctjs_docs/docs/', '').replace(/\.md$/, '.html')}`;
const toDocSlug = title => slugger
    .slug(title
        .replace(/^#+\s?/, '')
        .replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)')
        .replace(/\./g, '-')
        .replace(/[()]/g, ' ')
        .trim()
        .toLowerCase()
    );

// https://stackoverflow.com/a/47492545/13825612

/** @returns {boolean} */
const isDirectory = path => fs.statSync(path).isDirectory();

/** @returns {boolean} */
const isMarkdown = path => path.endsWith('.md');

/** @returns {Array<string>} */
const getDirectories = path =>
    fs.readdirSync(path)
    .map((name) => p.join(path, name))
    .filter(isDirectory);

/** @returns {Array<string>} */
const getFiles = path =>
    fs.readdirSync(path)
    .map((name) => p.join(path, name))
    .filter(isMarkdown);

/** @returns {Array<string>} */
const getFilesRecursively = path => {
    let dirs = getDirectories(path);
    let files = dirs
        .map(dir => getFilesRecursively(dir))
        .reduce((a, b) => a.concat(b), []);
    return files.concat(getFiles(path));
};

const examplesPatterns = {
    heading: /^(?<level>#+) (?<title>[^\r\n]+)/, // Matches headings. Captures the #### (level) and the title after that
    code: /^```(?:\w+)?$/, // Matches fenced code start/end with optional language
    exampleStrip: /^Example: /
};

/**
 * A simple parser that returns all examples from the docs. Examples should follow this format:
 *
 * ```md
 * # Definition
 * (optional content)
 * ## Example
 * (content)
 * ## Not an example, not captured
 * ## Example: An optional title
 * (more content)
 * ```
 *
 * Heading levels may vary.
 *
 * @param {IMdFile} file The MD file to parse
 * @return {Array<IExample>} All the examples in this file.
 */
const getAllExamplesFromFile = function getAllExamplesFromFile(file) {
    const lines = file.raw.split(/\r?\n/);
    const results = [];
    const state = {
        inCode: false,
        breadcrumbs: [],
        exampleHeading: false,
        exampleHeadingLevel: 0,
        pushing: false,
        currentResult: false
    };
    const pushResult = function () {
        results.push(state.currentResult);
        state.currentResult.lines = state.currentResult.lines
            .slice(1).join('\n')
            .trim();
        state.currentResult = false;
    }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (examplesPatterns.code.test(line)) {
            state.inCode = !state.inCode;
        }
        if (!state.inCode) {
            let heading = false;
            const match = line.match(examplesPatterns.heading);
            if (match) {
                heading = match.groups;
            }
            if (heading) {
                const level = heading.level.length;
                state.breadcrumbs[level] = heading.title;
                if (level <= state.exampleHeadingLevel) {
                    state.pushing = false;
                    if (state.currentResult) {
                        pushResult();
                    }
                }
                if (heading.title.startsWith('Example')) {
                    state.exampleHeading = heading.title.replace(examplesPatterns.exampleStrip, '');
                    state.exampleHeadingLevel = level;
                    state.currentResult = {
                        definition: state.breadcrumbs[level - 1],
                        title: state.exampleHeading,
                        hash: toDocSlug(state.exampleHeading),
                        url: file.url,
                        pageTitle: file.title,
                        lines: [],
                    }
                    state.pushing = true;
                }
            }
        }
        if (state.pushing) {
          state.currentResult.lines.push(line);
        }
    }
    if (state.currentResult) {
        pushResult();
    }
    return results;
};
const firstLine = /^[^\n\r]*/;
/**
 * @returns {Promise<Array<IMdFile>>}
 */
const getAllPages = async function getAllPages() {
    logger.info('Getting all the pages in the doc repo…')
    await gitRepoPromise;
    const mdFiles = getFilesRecursively(p.join(docpath, 'docs'));
    const filenames = [];
    let rawFiles = [];
    for (const file of mdFiles) {
        filenames.push(file);
        rawFiles.push(fs.readFile(file, 'utf-8'));
    }
    rawFiles = await Promise.all(rawFiles);
    const pages = filenames.map((filename, index) => ({
        filename,
        url: toDocUrl(filename),
        title: firstLine.exec(rawFiles[index])[0], // must be faster than splitting the file into lines
        raw: rawFiles[index]
    }));
    logger.success('Got all the pages 👌');
    return pages;
};
/**
 * @returns {Promise<Array<IExample>>}
 */
const getAllExamples = async function getAllExamples() {
    const mds = await lazilyGetAllPages();
    const results = [];
    for (const file of mds) {
        const examples = getAllExamplesFromFile(file);
        results.push(...examples);
    }
    logger.success('Updated examples 👌');
    return results;
};
/**
 * @returns {Promise<object<string,IHeadings>>}
 */
const getAllHeadings = async function getAllHeadings() {
    const index = {};
    const files = await lazilyGetAllPages();
    for (const file of files) {
        const headings = getHeadings(file.raw);
        index[file.filename] = {
            headings,
            url: file.url,
            title: file.title
        };
    }
    logger.success('Updated the doc index 👌');
    return index;
};

/**
 * @returns {Promise<Array<IMdFile>>}
 */
function lazilyGetAllPages() {
    return allPagesPromise || (allPagesPromise = getAllPages());
};
/**
 * @returns {Promise<Array<IExample>>}
 */
function lazilyGetAllExamples() {
    return allExamplesPromise || (allExamplesPromise = getAllExamples());
};
/**
 * @returns {Promise<object<string,IHeadings>>}
 */
function lazilyGetAllHeadings() {
    return allHeadingsPromise || (allHeadingsPromise = getAllHeadings());
};

module.exports = {
    // Either return the existing promise (usually with resolved data), or return a newly created one
    getAllPages: lazilyGetAllPages,
    getAllExamples: lazilyGetAllExamples,
    getAllHeadings: lazilyGetAllHeadings
};
