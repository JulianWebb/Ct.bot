const Embeds = require('../../embeds.js');
const { config, logger } = require('../../index.js');
const fetch = require('node-fetch');

const examplesBase = 'https://raw.githubusercontent.com/yonderbread/ctjs_examples/master/';
const examplesRoot = `${examplesBase}/root.json`;

const getRoot = () => fetch(examplesRoot).then(res => res['text']());
const getExample = (category, filename) => fetch(`${examplesBase}examples/${category}/${filename}`).then(res => res['text']());

module.exports = {
    name: 'example',
    description: 'View Ct.js examples by keyword.',
    usage: `${config.data.prefix}example [category] <topic>`,
    adminOnly: false,
    run(message, args) {
        if (!args || !args.length) {
            return message.reply(Embeds.info('#446adb', 'Error', 'Please specify a topic.', `Requested by ${message.author.tag}`));
        }
		if (args.length === 1) {
			getRoot().then(root => JSON.parse(root)).then((root) => {
				if (Object.keys(root).includes(args[0])) {
					let listEmbed = {
						title: `Available \`${args[0]}\` Topics`,
						color: 'BLUE',
						fields: [],
						timestamp: new Date()
					};
					for (const topic of Object.keys(root[args[0]])) {
						listEmbed.fields.push(
							{
								name: topic,
								value: root[args[0]][topic]['description']
							}
						)
					}
					listEmbed.footer = `View a topic with ${config.data.prefix}doc ${args[0]} <topic>`
					return message.reply(
					{embed: listEmbed}
					)
				} else {
					return message.reply(
						{
							embed: {
								title: 'Nothing Found',
								description: 'There were no example topics that matched your search.',
								color: 'YELLOW'
							}
						}
					)
				}	
			})
		} else if (args.length >= 2) {
			getRoot().then(root => JSON.parse(root)).then((root) => {
				if (Object.keys(root).includes(args[0])) {
					if (Object.keys(root[args[0]]).includes(args[1])) {
						const subtopic = root[args[0]][args[1]];
						getExample(args[0], args[1] + '.js').then((example) => {
							let subtopicEmbed = {
								color: 0x3333cc,
								title: `${args[0]} | ${args[1]}`,
								author: { 
									name: 'Link to Documentation',
									url: subtopic.link
								},
								description: `\`\`\`js\n${example}\`\`\``
							}
							message.reply({ embed: subtopicEmbed });
						});
					}
				} else {
					return message.reply(
						{
							embed: {
								title: 'Nothing Found',
								description: 'There were no example subtopics that matched your search.',
								color: 'YELLOW'
							}
						}
					)
				}	
			})
		}
    },
};
