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
                        return user.id === message.author.id;
                    };
                    msg.awaitReactions(filter, {
                        max: 1,
                        time: 4 * 60 * 1000,
                        errors: ['time'],
                    })
                        .then((reactions) => {
                            const reaction = reactions.first();

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
                                    const answer = collected.first().content;
                                    dmChannel.send(
                                        new MessageEmbed()
                                            .setTimestamp(new Date())
                                            .setTitle(
                                                msgs.commands.ask
                                                    .waiting_approval.title,
                                            )
                                            .setDescription(
                                                msgs.commands.ask.waiting_approval.description
                                                    .replace('{answer}', answer)
                                                    .replace(
                                                        '{question}',
                                                        question,
                                                    ),
                                            )
                                            .setColor('GREEN'),
                                    );
                                    const channel = message.client.channels.cache.get(
                                        approvalChannelId,
                                    );
                                    filter = (reaction3, user) => {
                                        return wlConfig.data.administrators.includes(
                                            user.id,
                                        );
                                    };
                                    channel
                                        .send(
                                            new MessageEmbed()
                                                .setTimestamp(new Date())
                                                .setTitle(
                                                    msgs.commands.ask
                                                        .needs_approval.title,
                                                )
                                                .setDescription(
                                                    `${msgs.commands.ask.needs_approval.description
                                                        .replace(
                                                            '{answer}',
                                                            answer,
                                                        )
                                                        .replace(
                                                            '{question}',
                                                            `${question}`,
                                                        )}\nAnswer by ${
                                                        message.author.tag
                                                    } (id: ${
                                                        message.author.id
                                                    })`,
                                                )
                                                .setColor('#00e2ff'),
                                        )
                                        .then((msg2 = new Message()) => {
                                            msg2.react('✅');
                                            msg2.awaitReactions(filter, {
                                                max: 1,
                                                time: 2 * 60 * 60 * 1000,
                                                errors: ['time'],
                                            })
                                                .then((reactions2) => {
                                                    const reaction2 = reactions2.last();

                                                    console.log(
                                                        reaction2.users.cache.last()
                                                            .id,
                                                    );
                                                    if (
                                                        reaction2.emoji.name ===
                                                            '✅' &&
                                                        wlConfig.data.administrators.includes(
                                                            reaction2.users.cache.last()
                                                                .id,
                                                        )
                                                    ) {
                                                        createAnswer(
                                                            question,
                                                            answer,
                                                        );
                                                        dmChannel.send(
                                                            new MessageEmbed()
                                                                .setTimestamp(
                                                                    new Date(),
                                                                )
                                                                .setTitle(
                                                                    msgs
                                                                        .commands
                                                                        .ask
                                                                        .approved
                                                                        .title,
                                                                )
                                                                .setDescription(
                                                                    msgs.commands.ask.approved.description
                                                                        .replace(
                                                                            '{answer}',
                                                                            answer,
                                                                        )
                                                                        .replace(
                                                                            '{question}',
                                                                            question,
                                                                        ),
                                                                )
                                                                .setColor(
                                                                    'GREEN',
                                                                ),
                                                        );
                                                        channel.send(
                                                            new MessageEmbed()
                                                                .setTimestamp(
                                                                    new Date(),
                                                                )
                                                                .setTitle(
                                                                    msgs
                                                                        .commands
                                                                        .ask
                                                                        .approved
                                                                        .title,
                                                                )
                                                                .setDescription(
                                                                    // eslint-disable-next-line prefer-template
                                                                    msgs.commands.ask.approved.description
                                                                        .replace(
                                                                            '{answer}',
                                                                            answer,
                                                                        )
                                                                        .replace(
                                                                            '{question}',
                                                                            question,
                                                                        ) +
                                                                        `\nBy: ${message.author.tag} (id ${message.author.id})`,
                                                                )
                                                                .setColor(
                                                                    'GREEN',
                                                                ),
                                                        );
                                                        logger.success(
                                                            `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${answer}\nBy: ${message.author.tag} (id ${message.author.id})`,
                                                        );
                                                    }
                                                })
                                                .catch((reactions2) =>
                                                    message.reply({
                                                        embed: {
                                                            color: 'RED',
                                                            title:
                                                                msgs.commands
                                                                    .ask
                                                                    .timed_out
                                                                    .title,
                                                            description:
                                                                msgs.commands
                                                                    .ask
                                                                    .timed_out
                                                                    .description,
                                                        },
                                                    }),
                                                );
                                        });
                                });
                            });
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
