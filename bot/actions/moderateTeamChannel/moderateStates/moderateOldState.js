const sequelize = require("../../../../sequelize");
const voiceChannelEmbed = require("../../../components/VoiceChannelEmbed");

module.exports = {
	name: 'moderateOldState',
	execute: async function (bot, oldState, server, active_channel) {
		if ((server ? server.type : active_channel.type) === "teamplay") {
			let active_channel = await sequelize.models.active_channels.findOne({
				where: {
					guild_id: oldState.guild.id,
					channel_id: oldState.channelId
				}
			});
			if (!active_channel) return;
			if (!server) {
				server = await sequelize.models.registered_channels.findOne({
					where: {
						guild_id: oldState.guild.id,
						voice_channel_id: active_channel.related_voice_channel_id
					}
				});
			}
			let ds_channel = bot.channels.cache.get(active_channel.channel_id)
			if (!ds_channel) return;

			let punish = await sequelize.models.users_punishments.findOne({
				where: {
					guild_id: oldState.guild.id,
					target_id: oldState.id,
					initiator_id: active_channel.owner_id,
					voice_channel_id: oldState.channelId,
					status: "created"
				}
			})
			if(punish)
			{
				//await oldState.voice.setMute(false);
				await punish.destroy();
			}

			await sequelize.models.users_punishments.destroy({
				where: {
					guild_id: oldState.guild.id,
					target_id: oldState.id,
					initiator_id: active_channel.owner_id,
					status: "premuted",
					voice_channel_id: oldState.channelId
				}
			})

			if (ds_channel.members.size === 0) {
				await bot.channels.cache.get(active_channel.channel_id).delete();
				await sequelize.models.active_interactions.destroy({
					where: {
						guild_id: oldState.guild.id,
						channel_id: oldState.channelId
					}
				});
				await sequelize.models.users_punishments.destroy({
					where: {
						guild_id: oldState.guild.id,
						voice_channel_id: oldState.channelId
					}
				})
				return;
			}
			if (oldState.member.id === active_channel.owner_id) {
				let random = Math.floor(Math.random() * ds_channel.members.size);
				let i = 0;
				for (let member of ds_channel.members) {
					if (i === random) {
						console.log(member[0]);
						await sequelize.query(`UPDATE active_channels
                                               SET owner_id = ${member[0]}
                                               WHERE guild_id = ${oldState.guild.id}
                                                 AND channel_id = ${oldState.channelId}`);
						active_channel.owner_id = member[0];
					}
					i++;
				}
			}
			let message = await bot.channels.cache.get(server.text_channel_id).messages.fetch(active_channel.related_message_id);
			let embed = message.embeds[0];
			let channel_size = await bot.channels.cache.get(oldState.channelId).members.size;
			let max_size = await bot.channels.cache.get(oldState.channelId).userLimit;
			let row = voiceChannelEmbed.execute(bot, server.name, server.id, `${embed.fields.map(field => field.value).join('\n').replace(`> <@${oldState.member.id}>`, "")}`, oldState.guild.name, oldState.guild.iconURL(), 0xFF0000, channel_size, max_size);
			await message.edit({embeds: [row], content: `Владелец канала: <@${active_channel.owner_id}>`});
		}
	}
}