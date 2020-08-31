const config = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'config',
    description: 'Configure this bot instance.',
    run(message, args) {
        if (args[0]) {
            if (args[0] === 'status') {
                if (args.length >= 2) {
                    const new_status = args.slice(1).join(' ');
                    const old_status = config.status;
                    config.status = new_status;
                    fs.writeFileSync(
                        '../../config.json',
                        JSON.stringify(config),
                    );

                    message.client.user.setActivity(new_status);
                    console.log(old_status, new_status);
                    const newStatusEmbed = {
                        title: 'Updated status',
                        color: 'AQUA',
                        description: `${message.member.user.tag} updated the status.`,
                        fields: [
                            {
                                name: 'New Status',
                                value: `${new_status}`,
                            },
                        ],
                    };

                    if (old_status != '') {
                        newStatusEmbed.fields.push(
                            {
                                name: 'Old Status',
                                value: `${old_status}`
                            }
                        )
                    }
                    return message.channel.send({
                        embed: newStatusEmbed,
                    });
                } else {
                    const errorEmbed = {
                        title: 'Error',
                        color: 'RED',
                        description: `You did not supply a new status.`,
                    };
                    return message.reply({
                        embed: errorEmbed,
                    });
                }
            }
        }
    },
};
