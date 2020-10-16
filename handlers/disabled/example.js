const { getAllExamples } = require('../../docs.js');
const { config } = require('../../index.js');
require('natures-jsutils');

const cleanTitle = (title) => title.replace(/^#+\s?/, '').replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)');

const imagePattern = /!\[(?<title>[^\r\n]*?)\]\((?<link>[\s\S]+?)\)/g;

module.exports = {
    name: 'example',
    description: 'View examples by keyword.',
    aliases: ['e', 'ex', 'examples'],
    adminOnly: false,
    usage: `${config.data.prefix}example <topic>`,
    async run(message, args) {
        const examples = await getAllExamples();
        if (!args || !args.length) {
            message.channel.send({
                embed: {
                    color: 'AQUA',
                    title: `We have ${examples.length} examples in total`,
                    description: `Add a keyword after the command to filter them, or run \`${message.client.prefix}example list\` to list them.`,
                    footer: 'Example: `${message.client.prefix}example module`',
                },
            });
            return;
        }

        const listReturnValue = await (async function() {
            if (args[0] === 'list') {
                const exampleTitles = [];
                for (const example of examples) {
                    exampleTitles.push({
                        name: example.definition,
                        value: `${example.lines.substring(0, 45).replaceAll('*', '')}...\n\nRun \`${
                            message.client.prefix
                        }example ${example.definition.substring(0, 15).toLowerCase()}\` to get the full example.`,
                    });
                }
                return message.channel.send({
                    embed: {
                        color: 'AQUA',
                        title: 'Examples:',
                        fields: exampleTitles,
                    },
                });
            }
        })();
        if (listReturnValue) return listReturnValue;

        const query = args.join(' ').toLowerCase();
        const results = [];
        for (const example of examples) {
            if (
                example.title.toLowerCase().indexOf(query) !== -1 ||
                example.definition.toLowerCase().indexOf(query) !== -1 ||
                example.pageTitle.toLowerCase().indexOf(query) !== -1
            ) {
                const noImagesLines = example.lines.replace(imagePattern, '(See image below, $1)');
                results.push({
                    name: `${cleanTitle(example.definition)}`,
                    value: noImagesLines,
                    sourceLines: example.lines,
                    url: `${example.url}#${example.hash}`,
                });
            }
        }
        if (!results.length) {
            message.channel.send({
                embed: {
                    color: 'RED',
                    title: 'Nothing found :c',
                },
            });
            return;
        }
        for (const result of results) {
            const images = result.sourceLines.matchAll(imagePattern);
            message.channel.send({
                content: `**${result.name}** (from ${result.url})\n\n${result.value}`,
            });

            if (images)
                for (const image of images) {
                    const embed = {
                        color: 'AQUA',
                        title: image.groups.title || 'Attached image',
                        image: {
                            url: `https://raw.githubusercontent.com/ct-js/docs.ctjs.rocks/master/docs/${image.groups.link.slice(2)}`,
                        },
                    };
                    message.channel.send({
                        embed,
                    });
                }
        }
    },
};
