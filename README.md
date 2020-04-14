# Discord/Twitch Emote Manager

Bot which automatically uploads Twitch emotes to a Discord server via chat commands.
Supports multiple servers.

# Setup and installation

1. Clone the repo
2. Install required dependencies using `npm install`
3. Copy `.env.example` to `.env` and fill out the necessary fields
4. Define the config options as listed below in `src/settings/config.js`
5. Run the bot using `node .`
6. Enjoy :)

### Config options:

-   Twitch
    -   `Prefix` - Prefix for the Twitch bot
    -   `Channels` - Array of channels for the bot to listen for commands in
    -   `Admins` - Array of Twitch user IDs considered to be bot admins
-   Discord
    -   `LoggingChannel` - Discord channel in which to log any command usage (ID)
    -   `Servers` - Object of key/value pairs assigning a name (to be mentioned via commands) to a target server ID. Example: `{ server1: "serverID", server2: "serverID" }`. Names MUST be in lowercase.

NOTE: After creating the [Discord bot](https://discordapp.com/developers/applications), you will need to invite said bot to your server(s) with the "Manage Emojis" permission. Only then can you add the server ID(s) to the configuration file.

# Commands

All commands are admin only.

-   `<prefix>addEmote <emote name> [target server]` - Adds the provided emote to the server specified. If no server is specified, the first server in the config file will be selected by default. You do not need to have the emote specified at the time of execution (any Twitch emote works fine). Emotes are case sensitive.

-   `<prefix>ping` - Displays bot information including uptime and both Twitch and Discord latency

# TODO

-   [ ] Add BTTV, FFZ, & global emote support

Accepting PRs ;)

# xd

Inspired by [Leppunen](https://twitch.tv/Leppunen):

-   [12:59:55] leppunen: i need to add a new command
-   [13:00:03] leppunen: a quick action command to yoink emotes
-   [13:00:09] leppunen: like -yoink forsenE
-   [13:00:14] leppunen: and it adds it to one of my emote servers
