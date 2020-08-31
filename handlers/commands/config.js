const { config, wlConfig, logger } = require('../../index.js');
const fs = require('fs');
const { Message } = require('discord.js');

module.exports = {
    name: 'config',
    description: 'Configure this bot instance.',
    run(message = new Message(), args) {
        if (wlConfig.data.administrators.includes(message.author.id)) {
            if (args[0]) {
                if (args[0] === 'status') {
                    if (args.length >= 2) {
                        const new_status = args.slice(1).join(' ');
                        const old_status = config.data.status;
                        config.data.status = new_status;
                        config.save();

                        message.client.user.setActivity(new_status);
                        logger.success(
                            `Changed the status to ${new_status} from ${old_status}`,
                        );
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
                            newStatusEmbed.fields.push({
                                name: 'Old Status',
                                value: `${old_status}`,
                            });
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
                if (args[0] === 'whitelist' || args[0] === 'wl') {
                    if (args.length >= 2) {
                        const member = message.guild.members.cache.get(args[1]);
                        if (member) {
                            wlConfig.addAdmin(member.user.id);
                            logger.success(
                                `Added ${member.user.tag} (id: ${member.user.id}) to the administrators!`,
                            );
                            return message.reply({
                                embed: {
                                    title: 'Success!',
                                    color: 'GREEN',
                                    description: `Added ${member.user.tag} (id: ${member.user.id}) to the whitelist!`,
                                },
                            });
                        } else {
                            return message.reply({
                                embed: {
                                    title: 'Error',
                                    color: 'RED',
                                    description: 'That member does not exist!',
                                },
                            });
                        }
                    } else {
                        const errorEmbed = {
                            title: 'Error',
                            color: 'RED',
                            description: `You did not supply a valid member ID!`,
                        };
                        return message.reply({
                            embed: errorEmbed,
                        });
                    }
                }
            } else {
                return message.reply({
                    embed: {
                        title: 'Error',
                        color: 'RED',
                        description: 'Please specify a config option!',
                    },
                });
            }
        } else {
            return message.reply({
                embed: {
                    title: 'Error',
                    color: 'RED',
                    description:
                        'You do not have permission to use this command!',
                },
            });
        }
    },
};
