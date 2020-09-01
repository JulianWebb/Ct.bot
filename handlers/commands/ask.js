const Embeds = require('../../embeds.js');
const { database, createAnswer } = require('../../database.js');
const { MessageEmbed, Message } = require('discord.js');
const { config, wlConfig, logger } = require('../../index.js');
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

        const part2 = (reactions) => {
            const reaction = reactions.first();

            message.author.createDM().then((dmChannel) => {
                dmChannel.send(
                    msgs.commands.ask.dm_message.replace(
                        '{question}',
                        `\`${question}\``,
                    ),
                );
                message.reply(msgs.commands.ask.sent_dm);
                const filter = (m) => m.author.id !== message.client.user.id;
                const collector = dmChannel.createMessageCollector(filter, {
                    time: 30000,
                    max: 1,
                });

                collector.on('collect', (m) => {
                    logger.info(`Collected ${m.content}`);
                });

                collector.on('end', (collected) => part3(collected, dmChannel));
            });
        };
        const part3 = (collected, dmChannel) => {
            const answer = collected.first().content;
            dmChannel.send(
                new MessageEmbed()
                    .setTimestamp(new Date())
                    .setTitle(msgs.commands.ask.waiting_approval.title)
                    .setDescription(
                        msgs.commands.ask.waiting_approval.description
                            .replace('{answer}', answer)
                            .replace('{question}', question),
                    )
                    .setColor('GREEN'),
            );
            const channel = message.client.channels.cache.get(
                approvalChannelId,
            );
            const filter = (reaction3, user) =>
                wlConfig.data.administrators.includes(user.id) &&
                user.id !== message.client.id &&
                reaction3.emoji.name === '✅';
            channel
                .send(
                    new MessageEmbed()
                        .setTimestamp(new Date())
                        .setTitle(msgs.commands.ask.needs_approval.title)
                        .setDescription(
                            `${msgs.commands.ask.needs_approval.description
                                .replace('{answer}', answer)
                                .replace(
                                    '{question}',
                                    `${question}`,
                                )}\nAnswer by ${message.author.tag} (id: ${
                                message.author.id
                            })`,
                        )
                        .setColor('#00e2ff'),
                )
                .then((msg2 = new Message()) => {
                    msg2.react('✅');
                    msg2.awaitReactions(filter, {
                        max: 1,
                        // time: 2 * 60 * 60 * 1000,
                        errors: ['time'],
                    })
                        .then((reactions) =>
                            part4(reactions, dmChannel, answer, channel),
                        )
                        .catch((reactions2) =>
                            message.reply({
                                embed: {
                                    color: 'RED',
                                    title: msgs.commands.ask.timed_out.title,
                                    description:
                                        msgs.commands.ask.timed_out.description,
                                },
                            }),
                        );
                });
        };

        // Creates the
        const part4 = (reactions2, dmChannel, answer, channel) => {
            const reaction2 = reactions2.last();

            createAnswer(question, answer);
            dmChannel.send(
                new MessageEmbed()
                    .setTimestamp(new Date())
                    .setTitle(msgs.commands.ask.approved.title)
                    .setDescription(
                        msgs.commands.ask.approved.description
                            .replace('{answer}', answer)
                            .replace('{question}', question),
                    )
                    .setColor('GREEN'),
            );
            channel.send(
                new MessageEmbed()
                    .setTimestamp(new Date())
                    .setTitle(msgs.commands.ask.approved.title)
                    .setDescription(
                        `${msgs.commands.ask.approved.description
                            .replace('{answer}', answer)
                            .replace('{question}', question)}\nBy: ${
                            message.author.tag
                        } (id ${message.author.id})\nApproved by: ${
                            reaction2.users.cache.last().tag
                        } (id ${reaction2.users.cache.last().id}`,
                    )
                    .setColor('GREEN'),
            );
            logger.success(
                `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${answer}\nBy: ${
                    message.author.tag
                } (id ${message.author.id})\nApproved by: ${
                    reaction2.users.cache.last().tag
                } (id ${reaction2.users.cache.last().id}`,
            );
        };

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

                    const filter = (reaction3, user) =>
                        user.id !== message.client.id &&
                        reaction3.emoji.name === '👍';

                    msg.awaitReactions(filter, {
                        max: 1,
                        time: 4 * 60 * 1000,
                        errors: ['time'],
                    })
                        .then(part2)
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
