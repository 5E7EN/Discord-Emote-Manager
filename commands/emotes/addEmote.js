const got = require('got');

module.exports = {
    name: 'addemote',
    aliases: ['emoteadd'],
    permission: 'Admin',
    cooldown: { type: 'UserCommandChannel', length: 1 },
    category: 'Emotes',
    description: 'Uploades a Twitch emote to Discord server specified (defaults to first server)',
    run: async (d) => {
        const args = d.message.args;
        const serverList = bot.Config.discord.Servers;

        if (!args[0]) return d.reply(`Usage: ${d.prefix + d.command} <emote> [server] (2nd param defaults to first server in config)`);
        if (args[1] && !serverList[args[1].toLowerCase()]) return d.reply('target server does not exist in configuration!');

        // Get target server
        const targetServer = args[1] ? bot.Discord.guilds.cache.get(serverList[args[1].toLowerCase()]) : bot.Discord.guilds.cache.get(serverList[Object.keys(serverList)[0]]);

        // Check if bot has emote manager perms
        if (!targetServer.me.hasPermission('MANAGE_EMOJIS')) return d.reply('I do not have sufficient permissions in the target Discord server. Make sure "Manage Emojis" is enabled for my role!');

        try {
            // Fetch emote data from API
            const emoteInfo = JSON.parse((await got(`https://api.ivr.fi/twitch/emotes/${args[0]}`)).body);

            // Upload emote to server
            targetServer.emojis.create(emoteInfo.emoteurl_3x, emoteInfo.emotecode).catch((error) => {
                return d.reply(`an error has occured while uploading the emote: ${error.message} monkaS`);
            });

            return d.reply(`successfully uploaded ${args[0]} to "${targetServer.name}"!`);
        } catch (error) {
            d.reply(`cannot find emote "${args[0]}" monkaS`);
        }
    },
};
