const sequelize = require("../../../sequelize");
module.exports = {
	name: 'selectPunishment',
	type: 'extended',
	execute: async function (interaction, bot) {
		let target_id = interaction.customId.replace("selectPunishment", "");
		let channel = await sequelize.models.active_channels.findOne({
			where: {
				guild_id: interaction.guild.id,
				owner_id: interaction.member.id,
			}
		})

		if (!channel) {
			await interaction.reply({content: "Ошибка!", ephemeral: true});
			return;
		}

		let punishment = await sequelize.models.users_punishments.findOne({
			where: {
				guild_id: interaction.guild.id,
				voice_channel_id: channel.channel_id,
				target_id: target_id,
				initiator_id: interaction.member.id,
			}
		});
		if(!punishment) return;

		if (interaction.values[0] === "kick") {
			let member = await interaction.guild.members.fetch(punishment.target_id);
			await member.voice.disconnect("kicked by bot");
			await interaction.update({content: "Пользователь выгнан из канала!", components: [], ephemeral: true});
			await sequelize.models.users_punishments.destroy({
				where: {
					guild_id: interaction.guild.id,
					voice_channel_id: channel.channel_id,
					status: "created",
					target_id: punishment.target_id,
					initiator_id: interaction.member.id
				}
			})
			/*let server = await sequelize.models.registered_channels.findOne({
				where: {
					guild_id: interaction.guild.id,
					voice_channel_id: channel.related_voice_channel_id
				}
			})*/
			/*let message = await bot.channels.cache.get(server.text_channel_id).messages.fetch(channel.related_message_id);
			let embed = message.embeds[0];
			let channel_size = await bot.channels.cache.get(channel.channel_id).members.size;
			let max_size = await bot.channels.cache.get(channel.channel_id).userLimit;
			let row = voiceChannelEmbed.execute(bot, server.name, server.id, embed.fields[0].value, interaction.guild.name, interaction.guild.iconURL(), 0x00FF00, channel_size, max_size);
			try{
				await message.edit(
					{
						embeds: [row],
						content: `Владелец канала: <@${channel.owner_id}>`,
						components: [await userSelectMenu.execute(bot, channel.channel_id), await joinChannelButton.execute(bot, channel.channel_id)]
					});
			}
			catch (e) {
				console.log(e);
			}*/
			return;
		}
		if (interaction.values[0] === "mute") {
			if(punishment.status === "muted") {
				let member = bot.channels.cache.get(channel.channel_id).members.find(member => member.id === punishment.target_id);
				await member.voice.setMute(false, "unmuted by bot");
				await interaction.update({content: "Пользователь размучен!", components: [], ephemeral: true});
				await sequelize.models.users_punishments.destroy({
					where: {
						guild_id: interaction.guild.id,
						voice_channel_id: channel.channel_id,
						status: "muted",
						target_id: target_id,
						initiator_id: interaction.member.id
					}
				})
			}
			else{
				let member = bot.channels.cache.get(channel.channel_id).members.find(member => member.id === punishment.target_id);
				await member.voice.setMute(true, "muted by bot");
				await interaction.update({content: "Пользователь замучен!", components: [], ephemeral: true});
				await sequelize.models.users_punishments.update({
					status: "muted"
				}, {
					where: {
						guild_id: interaction.guild.id,
						voice_channel_id: channel.channel_id,
						status: "created",
						target_id: target_id,
						initiator_id: interaction.member.id
					}
				})
			}
		}
	}
}