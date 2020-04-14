const client = require('tmi.js').Client({
    connection: { secure: true, reconnect: true },
    identity: { username: bot.Config.twitch.Username, password: bot.Config.twitch.Password },
});

client.initialize = async () => {
    await client.connect().then(() => {
        bot.Logger.info('[Twitch] - Client connected!');
    });
};

client.on('join', (channel, username, self) => {
    if (self) bot.Logger.info(`[Twitch] - Joined ${channel}`);
});

client.on('part', (channel, username, self) => {
    if (self) bot.Logger.warn(`[Twitch] - Parted ${channel}`);
});

client.on('disconnected', (reason) => {
    bot.Logger.error(`[Twitch] - Client disconnected: ${reason}`);
});

client.on('message', async (channel, tags, message) => {
    //if (tags['username'] === bot.Config.twitch.Username.toLowerCase()) return;

    const prefix = bot.Config.twitch.Prefix;
    const args = message.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.startsWith(prefix)) return;

    const msgMeta = {
        user: {
            id: tags['user-id'],
            name: tags['display-name'],
            login: tags['username'],
            color: tags['color'],
            badges: tags['badges'],
        },
        message: {
            text: message,
            args,
            tags,
        },
        channel: {
            name: channel,
            id: tags['room-id'],
        },
        prefix,
        command,

        send: async (message) => {
            bot.Twitch.say(channel, `${message}`);
        },
        reply: async (message) => {
            bot.Twitch.say(channel, `@${tags['display-name']}, ${message}`);
        },
    };

    // Execute command
    bot.Command.execute(msgMeta);
});

module.exports = client;
