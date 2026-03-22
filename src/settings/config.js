require('dotenv').config();

// Configuration descriptions can be found in the README

module.exports.twitch = {
    Username: process.env.Twitch_Username,
    Password: process.env.Twitch_oAuth,
    Prefix: '!',
    Channels: [''],
    Admins: [''],
};

module.exports.discord = {
    AuthToken: process.env.Discord_AuthToken,
    LoggingChannel: '',
    Servers: {
        server1: 'serverID',
    },
};
