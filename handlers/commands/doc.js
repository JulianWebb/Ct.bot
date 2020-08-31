const Embeds = require('../../embeds.js');
const docs = require('../../docs.js');
const slugger = require('github-slugger');

let cachedDocs = {};
docs.clone();
docs.parse().then((docs) => (cachedDocs = docs));

module.exports = {
    name: 'doc',
    description: 'View documentation topics by keyword.',
    run(message, args) {
        if (!args || !args.length) {
            message.channel.send(Embeds.info('#446adb'));
            return;
        }
        const query = args.join(' ');
        const results = [];
        for (const file in cachedDocs) {
            for (const heading of cachedDocs[file].headings) {
                if (heading.toLowerCase().indexOf(query) !== -1) {
                    let strippedHeading = heading
                        .replace(/^#+\s?/, '')
                        .replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)');
                    const slug = slugger.slug(
                        strippedHeading.replace(/\./g, '-').toLowerCase(),
                    );
                    results.push({
                        name: `${strippedHeading} at ${cachedDocs[file].title
                            .replace(/^#+\s?/, '')
                            .replace(/<badge>([\s\S]+?)<\/badge>/gi, '($1)')}`,
                        value: `https://docs.ctjs.rocks/${file}.html#${slug}`,
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
        message.channel.send({
            embed: {
                color: 'AQUA',
                title: "Here is what I've found:",
                fields: results,
            },
        });
    },
};
