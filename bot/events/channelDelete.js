const serverExists = require("../actions/serverExists");
const insertServer = require("../actions/insertServer.js");
const sequelize = require("../../sequelize");

module.exports = {
	name: 'channelDelete',
	type: 'simple',
	execute: async function (bot, channel) {
		if (!await serverExists(channel.guild.id)) insertServer(channel.guild.name, channel.guild.id);
		let res = await sequelize.models.active_channels.findOne({
			where: {
				guild_id: channel.guild.id,
				channel_id: channel.id
			}
		});

		if (res && res.type === "teamplay") {
			let server = await sequelize.models.registered_channels.findOne({
				where: {
					guild_id: channel.guild.id,
					voice_channel_id: res.related_voice_channel_id
				}
			})
			let interaction = await sequelize.models.active_interactions.findOne({
				where: {
					guild_id: channel.guild.id,
					channel_id: channel.id
				}
			})
			if (interaction) {
				bot.channels.cache.get(server.text_channel_id).messages.fetch(interaction.interaction_id).then(message => {
					message.delete();
				});
				await sequelize.models.active_interactions.destroy({
					where: {
						guild_id: channel.guild.id,
						channel_id: channel.id
					}
				});
			}
		}
		if (res) {
			await sequelize.models.active_channels.destroy({
				where: {
					guild_id: channel.guild.id,
					channel_id: channel.id
				}
			});
		}
	}
}