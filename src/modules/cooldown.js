bot.Cooldowns = {};
bot.Cooldowns.Twitch = {};

module.exports = (msgMeta, options = {}) => {
    if (!options.type) options.type = 'UserCommand';
    if (!options.mode) options.mode = 'add';

    if (!bot.Cooldowns.Twitch[msgMeta.channel.id]) {
        bot.Cooldowns.Twitch[msgMeta.channel.id] = { name: msgMeta.channel.name, cooldown: 0 };
    }

    if (!bot.Cooldowns.Twitch[msgMeta.channel.id][msgMeta.command]) {
        bot.Cooldowns.Twitch[msgMeta.channel.id][msgMeta.command] = { cooldown: 0 };
    }

    if (!bot.Cooldowns.Twitch[msgMeta.channel.id][msgMeta.user.id]) {
        bot.Cooldowns.Twitch[msgMeta.channel.id][msgMeta.user.id] = { name: msgMeta.user.name, login: msgMeta.user.login, cooldown: 0 };
    }

    const now = Date.now();
    const channelObject = bot.Cooldowns.Twitch[msgMeta.channel.id];

    if (options.mode === 'add') {
        if (options.type === 'User') {
            channelObject[msgMeta.user.id] = { cooldown: now + options.length };
        }

        if (options.type === 'Channel') {
            channelObject[msgMeta.command] = { cooldown: now + options.length };
        }

        if (options.type === 'UserCommand') {
            channelObject[msgMeta.user.id][msgMeta.command] = { cooldown: now + 3 * 500 };
        }

        if (options.type === 'UserCommandChannel') {
            channelObject[msgMeta.user.id][msgMeta.command] = { cooldown: now + options.length };
            channelObject[msgMeta.command] = { cooldown: now + options.length };
        }
    }

    if (options.mode === 'check') {
        const targetUser = channelObject[msgMeta.user.id];
        if (targetUser.cooldown > now) {
            return true;
        }

        const targetCmd = channelObject[msgMeta.command];
        if (targetCmd.cooldown > now) {
            return true;
        }

        const targetUserCmd = channelObject[msgMeta.user.id][msgMeta.command];
        if (targetUserCmd && targetUserCmd.cooldown > now) {
            return true;
        }

        return false;
    }
};
