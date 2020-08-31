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
        database.child(question).once('value', (snap) => {
            value = snap.val();
            if (value === null) {
                message.channel
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
                    .then((msg) => msg.react('👍'));
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
