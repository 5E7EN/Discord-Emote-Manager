// Namespace Initialization
global.bot = {};
bot.Store = {};

// Load Modules
bot.Config = require('./settings/config');
bot.Logger = require('./utils/winston');
bot.Modules = require('./modules');
bot.Command = require('./modules/command');

// Load Clients
bot.Discord = require('./clients/discord');
bot.Twitch = require('./clients/twitch');

// Commands
bot.Store.cmds = new Map();
bot.Store.cmdAliases = new Map();

(async () => {
    try {
        // Initialize commands and clients
        await bot.Command.loadAll();
        await bot.Discord.initialize();
        await bot.Twitch.initialize();

        // Join Twitch channels
        for (channel of bot.Config.twitch.Channels) {
            await bot.Twitch.join(channel);
        }
    } catch (error) {
        bot.Logger.error(`[Main] - Error encountered during initialization: ${error}`);
    }
})();
