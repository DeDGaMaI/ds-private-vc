const {Collection} = require("discord.js");
const sequelize = require("../../sequelize");

module.exports = {
	name: 'ready',
	type: 'simple',
	execute: async function (bot) {
		bot.commands = new Collection();
		bot.custom = {}

		bot.custom.interactions = new Map();
		let commands = require("../deployCommands").deploy()
		commands.forEach(command => {
			bot.commands.set(command.data.name, command.execute);
			bot.application?.commands.create(command.data);
		});

		let channels = await sequelize.models.active_channels.findAll();
		channels.forEach(channel => {
			let ds_channel = bot.channels.cache.get(channel.channel_id)
			if(!ds_channel) return;
			if(ds_channel.members.size === 0)
				ds_channel.delete();
		})
		console.log("Ready!");
	}
}