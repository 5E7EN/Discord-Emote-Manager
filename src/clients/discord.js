const client = new (require('discord.js').Client)();

client.initialize = async () => {
    await client.login(bot.Config.discord.AuthToken);

    return new Promise((resolve) => {
        client.once('ready', async () => {
            // Ensure logging channel exists and is valid
            if (!bot.Config.discord.LoggingChannel || !client.channels.cache.has(bot.Config.discord.LoggingChannel)) {
                return bot.Logger.error('[Discord] - Logging channel does not exist or is invalid!');
            }

            // Ensure at least 1 guild exist in config
            if (Object.getOwnPropertyNames(bot.Config.discord.Servers).length === 0) {
                return bot.Logger.error('[Discord] - At least one server must be defined in configuration file!');
            }

            // Ensure guilds from config are valid
            for (const property in bot.Config.discord.Servers) {
                if (!client.guilds.cache.has(bot.Config.discord.Servers[property])) {
                    return bot.Logger.error('[Discord] - Invalid server ID defined in configuration file!');
                }
            }

            bot.Logger.info('[Discord] - Client connected!');
            client.loggingChannel = client.channels.cache.get(bot.Config.discord.LoggingChannel);

            resolve();
        });
    });
};

client.on('disconnect', () => {
    bot.Logger.error('[Discord] - Client disconnected.');
});

module.exports = client;
