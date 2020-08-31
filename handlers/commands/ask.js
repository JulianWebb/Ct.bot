const Embeds = require('../../embeds.js');
const { database } = require('../../database.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ask',
    description: 'Checks if the database has an answer to the question',
    run(message, args) {
        if (!args || !args.length) {
            message.channel.send(Embeds.info('#446adb'));
            return;
        }
        const question = args.join(' ').toLowerCase();
        let value = null;
        database.child(question).once('value', async (snap) => {
            value = snap.val();
            if (value === null) {
                const msg = await message.channel
                    .send(
                        new MessageEmbed()
                            .setTitle(
                                `Couldn't find an answer :c\n\nKnow the answer? React with 👍 to add the answer!`,
                            )
                            .setColor('RED')
                            .setFooter(
                                'Requested by ' + message.member.user.tag,
                            ),
                    )
                await msg.react('👍');

                const filter = (reaction, user) => { return reaction.emoji.name === '👍' && user.id === message.author.id };
                msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                .then(reactions => {
                    const reaction = reactions.first();

                    if (reaction.emoji.name === '👍') {
                        message.reply('We have sent you a DM message.');
                    }
                }).catch(reactions => message.reply('Timed out.'));
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
