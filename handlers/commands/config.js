const { config, wlConfig, logger } = require('../../index.js');
const fs = require('fs-extra');
const { Message } = require('discord.js');

const configOptions = {
    status(message, args) {
        if (args.length >= 2) {
            const newStatus = args.slice(1).join(' ');
            const oldStatus = config.data.status;
            config.data.status = newStatus;
            config.save();

            message.client.user.setActivity(newStatus);
            logger.success(`Changed the status to ${newStatus} from ${oldStatus}`);
            const newStatusEmbed = {
                title: 'Updated status',
                color: 'BLUE',
                description: `${message.member.displayName} updated the status.`,
                fields: [
                    {
                        name: 'New Status',
                        value: `${newStatus}`,
                    },
                ],
            };

            if (oldStatus !== '') {
                newStatusEmbed.fields.push({
                    name: 'Old Status',
                    value: `${oldStatus}`,
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
    },
    wl(message, args) {
        if (args.length >= 2) {
            const member = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
            if (member) {
                if (wlConfig.data.administrators.includes(member.id)) {
                    wlConfig.removeAdmin(member.id);
                    logger.success(`Removed ${member.displayName || member.username} (id: ${member.id}) from the administrator whitelist.`);
                    return message.reply({
                        embed: {
                            title: 'Success!',
                            color: 'GREEN',
                            description: `Removed ${member.displayName || member.username} (id: ${member.id}) from the administrator whitelist.`,
                        },
                    });
                }
                wlConfig.addAdmin(member.id);
                logger.success(`Added ${member.displayName || member.username} (id: ${member.id}) to the administrator whitelist.`);
                return message.reply({
                    embed: {
                        title: 'Success!',
                        color: 'GREEN',
                        description: `Added ${member.displayName || member.username} (id: ${member.id}) to the whitelist!`,
                    },
                });
            } else {
                return message.reply({
                    embed: {
                        title: 'Error',
                        color: 'RED',
                        description: `That member does not exist!`,
                    },
                });
            }
        } else {
            const errorEmbed = {
                title: 'Error',
                color: 'RED',
                description: `You did not supply a valid member ID or mention!`,
            };
            return message.reply({
                embed: errorEmbed,
            });
        }
    },
};

module.exports = {
    name: 'config',
    description: 'Configure this bot instance.',
    usage: `${config.data.prefix}config [option] [value]`,
    aliases: ['c', 'conf'],
    adminOnly: true,
    run(message = new Message(), args) {
        if (wlConfig.data.administrators.includes(message.author.id) || message.member.permissions.has('ADMINISTRATOR')) {
            if (args[0]) {
                if (args[0] === 'status') {
                    configOptions.status(message, args);
                }
                if (args[0] === 'whitelist' || args[0] === 'wl') {
                    configOptions.wl(message, args);
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
                    description: 'You do not have permission to use this command!',
                },
            });
        }
    },
};
