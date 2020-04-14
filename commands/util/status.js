module.exports = {
    name: 'status',
    aliases: ['ping'],
    permission: 'Admin',
    cooldown: { type: 'UserCommandChannel', length: 1 },
    category: 'Utility',
    description: 'Displays bot information',
    run: async (d) => {
        d.reply(
            `Twitch latency: ${Math.floor(Math.round((await bot.Twitch.ping()) * 1000))}ms | Discord latency: ${Math.round(bot.Discord.ws.ping)}ms | Online for ${require('humanize-duration')(
                Math.floor(process.uptime()) * 1000
            )}`
        );
    },
};
