const { getAllHeadings } = require('../../docs.js');

const slugger = require('github-slugger');

const cleanTitle = (title) => title.replace(/^#+\s?/, '').replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)');
const toDocSlug = (title) => slugger.slug(cleanTitle(title).replace(/\./g, '-').replace(/[()]/g, ' ').trim().toLowerCase());

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    aliases: ['d', 'docs'],
    adminOnly: false,
    async run(message, args) {
        if (!args || !args.length) {
            message.channel.send({
                content: 'Oh no',
            });
            return;
        }
        const index = await getAllHeadings();
        const query = args.join(' ').toLowerCase();
        const results = [];
        for (const file in index) {
            for (const heading of index[file].headings) {
                if (heading.toLowerCase().indexOf(query) !== -1) {
                    results.push({
                        name: `${cleanTitle(heading)} at ${cleanTitle(index[file].title)}`,
                        value: `${index[file].url}#${toDocSlug(heading)}`,
                    });
                }
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
        const embed = {
            color: 'AQUA',
            title: "Here is what I've found:",
            fields: results,
        };
        message.channel.send({
            embed,
        });
    },
};
