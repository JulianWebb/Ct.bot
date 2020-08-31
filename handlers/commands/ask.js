const Embeds = require('../../embeds.js');
const { database, createAnswer } = require('../../database.js');
const { MessageEmbed, Message } = require('discord.js');
const logger = require('../../index.js').logger;

module.exports = {
    name: 'ask',
    description: 'Checks if the database has an answer to the question',
    run(message = new Message(), args) {
        if (!args || !args.length) {
            message.channel.send(Embeds.info('#446adb'));
            return;
        }
        const question = args.join(' ').toLowerCase();
        let value = null;
        database.child(question).once('value', async (snap) => {
            value = snap.val();
            if (value === null) {
                const msg = await message.channel.send(
                    new MessageEmbed()
                        .setTitle(
                            `Couldn't find an answer :c\n\nKnow the answer? React with 👍 to add the answer!`,
                        )
                        .setColor('RED')
                        .setFooter('Requested by ' + message.member.user.tag),
                );
                await msg.react('👍');

                const filter = (reaction, user) => {
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
                                    `Please reply with your answer to the question '${question}' (in one message).`,
                                );
                                message.reply('We have sent you a DM message.');
                                const filter = (m) =>
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
                                        Array.from(collected)[0][1].content,
                                    );
                                    dmChannel.send(
                                        `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${
                                            Array.from(collected)[0][1].content
                                        }`,
                                    );
                                    logger.success(
                                        `The answer has been created with info:\nQuestion: ${question}\nAnswer: ${
                                            Array.from(collected)[0][1].content
                                        }\nBy: ${message.author.tag} (id ${
                                            message.author.id
                                        })`,
                                    );
                                });
                            });
                        }
                    })
                    .catch((reactions) =>
                        message.reply('Timed out or errored.'),
                    );
            } else {
                message.channel.send(
                    new MessageEmbed()
                        .setTitle(`Answer:`)
                        .setColor('GREEN')
                        .setDescription(value)
                        .setFooter('Requested by ' + message.member.user.tag),
                );
            }
        });
    },
};
