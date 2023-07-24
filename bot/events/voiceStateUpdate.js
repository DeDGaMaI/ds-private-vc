const serverExists = require("../actions/serverExists");
const insertServer = require("../actions/insertServer.js");
const sequelize = require("../../sequelize");

module.exports = {
	name: 'voiceStateUpdate',
	type: 'simple',
	execute: async function (bot, oldState, newState) {
		if(oldState.serverMute && !newState.serverMute)
		{
			await sequelize.models.users_punishments.destroy({
				where: {
					guild_id: oldState.guild.id,
					target_id: oldState.id,
					status: "premuted",
					voice_channel_id: oldState.channelId
				}
			})
		}
		if(oldState.channelId === newState.channelId) return;
		let state = (oldState.channelId ? oldState : newState);
		if (!await serverExists(state.guild.id)) insertServer(state.guild.name, state.guild.id);

		let server = await sequelize.models.registered_channels.findOne({
			where: {
				guild_id: state.guild.id,
				voice_channel_id: newState.channelId
			}
		});

		let active_channel = await sequelize.models.active_channels.findOne({
			where: {
				guild_id: state.guild.id,
				channel_id: state.channelId
			}
		})

		if (!(server || active_channel)) return;

		if ((server ? server.type : active_channel.type) === "communicate") {
			require("../actions/moderateComChannel/moderateComChannel.js").execute(bot, oldState, newState, server);
		}
		if((server ? server.type : active_channel.type) === "teamplay") {
			require("../actions/moderateTeamChannel/moderateTeamChannel.js").execute(bot, oldState, newState, server, active_channel);
		}
	}
}