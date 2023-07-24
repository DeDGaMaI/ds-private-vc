const voiceChannelEmbed = require("../../../components/VoiceChannelEmbed");
const userSelectMenu = require("../../../components/UserSelectMenu");
const joinChannelButton = require("../../../components/JoinChannelButton");
const sequelize = require("../../../../sequelize");
const {PermissionsBitField} = require("discord.js");

module.exports = {
	name: 'moderateNewState',
	execute: async function (bot, newState, server, active_channel) {
		if ((server ? server.type : active_channel.type) === "teamplay") {
			if (server && newState.channelId === server.voice_channel_id) {
				let channel = await bot.guilds.cache.get(server.guild_id).channels.create({
					name: server.name + " " + server.id,
					type: 2,
					parent: server.active_parent_id,
					userLimit: server.channel_size,
					permissionOverwrites: [
						{
							id: bot.user.id,
							allow: PermissionsBitField.Flags.MuteMembers
						}
					]
				})

				await newState.setChannel(channel);

				let max_size = await bot.channels.cache.get(newState.channelId).userLimit;
				let channel_size = await bot.channels.cache.get(newState.channelId).members.size;
				let row = voiceChannelEmbed.execute(bot, server.name, server.id, `> <@${newState.member.id}>`, newState.guild.name, (newState.guild.iconURL() || "https://filmshusid.fo/wp-content/themes/films/assets/images/default.png"), 0x00FF00, channel_size, max_size);
				let message = await bot.channels.cache.get(server.text_channel_id).send({
					content: `Владелец канала: <@${newState.member.id}>`,
					embeds: [row],
					components: [await userSelectMenu.execute(bot, channel.id), await joinChannelButton.execute(bot, channel.id)]
				});

				if(newState.member.voice.serverMute) {
					await sequelize.models.users_punishments.create({
						guild_id: newState.guild.id,
						voice_channel_id: newState.channelId,
						target_id: newState.member.id,
						initiator_id: newState.member.id,
						status: "premuted"
					})
				}

				await sequelize.models.active_channels.create({
					guild_id: server.guild_id,
					channel_id: channel.id,
					type: "teamplay",
					parent_id: server.active_parent_id,
					owner_id: newState.member.id,
					related_voice_channel_id: server.voice_channel_id,
					related_message_id: message.id,
				});

				await sequelize.models.active_interactions.create({
					guild_id: server.guild_id,
					channel_id: channel.id,
					interaction_id: message.id,
					type: "active_channel",
					owner_id: newState.member.id,
				})
			} else {
				let active_channel = await sequelize.models.active_channels.findOne({
					where: {
						guild_id: newState.guild.id,
						channel_id: newState.channelId
					}
				});
				if (!active_channel) return;
				if (!server) {
					server = await sequelize.models.registered_channels.findOne({
						where: {
							guild_id: newState.guild.id,
							voice_channel_id: active_channel.related_voice_channel_id
						}
					});
				}

				if(newState.member.voice.serverMute) {
					await sequelize.models.users_punishments.create({
						guild_id: newState.guild.id,
						voice_channel_id: newState.channelId,
						target_id: newState.member.id,
						initiator_id: active_channel.owner_id,
						status: "premuted"
					})
				}

				let message = await bot.channels.cache.get(server.text_channel_id).messages.fetch(active_channel.related_message_id);
				let embed = message.embeds[0];
				let channel_size = await bot.channels.cache.get(newState.channelId).members.size;
				let max_size = await bot.channels.cache.get(newState.channelId).userLimit;
				let row = voiceChannelEmbed.execute(bot, server.name, server.id, `${embed.fields.map(field => field.value).join('\n')}\n> <@${newState.member.id}>`, newState.guild.name, (newState.guild.iconURL() || "https://filmshusid.fo/wp-content/themes/films/assets/images/default.png"), 0x00FF00, channel_size, max_size);
				await message.edit(
					{
						embeds: [row],
						content: `Владелец канала: <@${active_channel.owner_id}>`,
						components: [await userSelectMenu.execute(bot, active_channel.channel_id), await joinChannelButton.execute(bot, active_channel.channel_id)]
					});
			}
		}
	}
}