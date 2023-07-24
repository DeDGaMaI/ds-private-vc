const {
	Client, GatewayIntentBits
} = require('discord.js');
let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});
require("./deployEvents").deploy().forEach(event => {
	bot.on(event.name, (...args) => event.execute(bot, ...args));
})

module.exports = bot;