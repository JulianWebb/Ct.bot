const Embeds = require('../../embeds.js');
const { database, createAnswer } = require('../../database.js');
const { MessageEmbed, Message } = require('discord.js');
const { config, logger } = require('../../index.js');
const msgs = require('../../messages.json');

const approvalChannelId = '749765057440776222';

module.exports = {
    name: 'ask',
    description: 'Checks for answers to previously asked questions',
    usage: `${config.data.prefix}ask [question]`,
    adminOnly: false,
    run(message = new Message(), args) {
        if (!args || !args.length) {
            message.channel.send(Embeds.info('#446adb'));
            return;
        }
        const question = args.join(' ').toLowerCase();
        let value = null;
        database
            .child('questions')
            .child(question)
            .once('value', async (snap) => {
                value = snap.val();
                if (value === null) {
                    const msg = await message.channel.send(
                        new MessageEmbed()
                            .setTitle(msgs.commands.ask.no_answer.title)
                            .setDescription(
                                msgs.commands.ask.no_answer.description,
                            )
                            .setColor('RED')
                            .setFooter(
                                `Requested by ${message.member.user.tag}`,
                            ),
                    );
                    await msg.react('👍');

                    let filter = (reaction, user) => {
                        return (
                            reaction.emoji.name === '👍' &&
                            user.id === message.author.id
                        );
                    };
                    msg.awaitReactions(filter, {
                        max: 1,
                        time: 4 * 60 * 1000,
                        errors: ['time'],
                    })
                        .then((reactions) => {
                            const reaction = reactions.first();

                            if (reaction.emoji.name === '👍') {
                                message.author.createDM().then((dmChannel) => {
                                    dmChannel.send(
                                        msgs.commands.ask.dm_message.replace(
                                            '{question}',
                                            `\`${question}\``,
                                        ),
                                    );
                                    message.reply(msgs.commands.ask.sent_dm);
                                    filter = (m) =>
                                        m.author.id !== message.client.user.id;
                                    const collector = dmChannel.createMessageCollector(
                                        filter,
                                        { time: 30000, max: 1 },
                                    );

                                    collector.on('collect', (m) => {
                                        logger.info(`Collected ${m.content}`);
                                    });

                                    collector.on('end', (collected) => {
                                        // TODO: send to approval people
                                        createAnswer(
                                            question,
                                            collected.first().content,
                                        );
                                        dmChannel.send(
                                            `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${
                                                collected.first().content
                                            }`,
                                        );
                                        logger.success(
                                            `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${
                                                collected.first().content
                                            }\nBy: ${message.author.tag} (id ${
                                                message.author.id
                                            })`,
                                        );
                                    });
                                });
                            }
                        })
                        .catch((reactions) =>
                            message.reply({
                                embed: {
                                    color: 'RED',
                                    title: msgs.commands.ask.timed_out.title,
                                    description:
                                        msgs.commands.ask.timed_out.description,
                                },
                            }),
                        );
                } else {
                    message.channel.send(
                        new MessageEmbed()
                            .setTitle(`Answer:`)
                            .setColor('GREEN')
                            .setDescription(value)
                            .setFooter(
                                `Requested by ${message.member.user.tag}`,
                            ),
                    );
                }
            });
    },
};
