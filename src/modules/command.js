const { readdirSync } = require('fs');

module.exports.loadAll = () => {
    return new Promise((resolve, reject) => {
        bot.Store.cmds.clear();
        bot.Store.cmdAliases.clear();

        const table = new (require('ascii-table'))();
        table.setHeading('File', 'Command', 'Aliases', 'Access Level', 'Load Status');

        readdirSync('./commands').forEach((dir) => {
            const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));

            for (let file of commands) {
                try {
                    delete require.cache[require.resolve(`${process.cwd()}/commands/${dir}/${file}`)];
                    let pull = require(`${process.cwd()}/commands/${dir}/${file}`);

                    if (pull.name) {
                        bot.Store.cmds.set(pull.name, pull);
                        table.addRow(file, pull.name, pull.aliases.join(', '), pull.permission, '✅');
                    } else {
                        table.addRow(file, pull.name, pull.aliases.join(', '), pull.permission, '❌  -> missing command name');
                        continue;
                    }

                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => bot.Store.cmdAliases.set(alias, pull.name));
                } catch (e) {
                    bot.Logger.error(`Failed to load command file ${file}. Error: ${e.message}`);
                    return reject(e);
                }
            }
        });

        table.setTitle(`Loaded ${bot.Store.cmds.size} Command(s)`);
        console.log(table.toString());

        return resolve();
    });
};

module.exports.execute = async (msgMeta) => {
    let commandData = bot.Store.cmds.get(msgMeta.command);

    if (!commandData) commandData = bot.Store.cmds.get(bot.Store.cmdAliases.get(msgMeta.command));

    if (commandData) {
        // Check for cooldowns
        if (bot.Modules.cooldown(msgMeta, { mode: 'check' })) return;

        // Apply cooldowns
        bot.Modules.cooldown(msgMeta, { type: commandData.cooldown.type, length: commandData.cooldown.length * 1000 });

        // Check permissions
        if (commandData.permission === 'Admin' && !bot.Config.twitch.Admins.includes(msgMeta.user.id)) return;

        // Log command usage
        bot.Discord.loggingChannel.send({
            embed: {
                author: {
                    name: 'Command Usage',
                    icon_url: 'https://5e7en.me/assets/icons/twitchlogo.png',
                },
                fields: [
                    { name: 'Command', value: msgMeta.prefix + msgMeta.command },
                    { name: 'Username', value: `${msgMeta.user.name} (${msgMeta.user.login})` },
                    { name: 'Channel', value: msgMeta.channel.name },
                    { name: 'Args', value: `${msgMeta.message.args.join(' ') || 'none'}` },
                ],
            },
        });

        // Execute
        commandData.run(msgMeta);
    }
};
