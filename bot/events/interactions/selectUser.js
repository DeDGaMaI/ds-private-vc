const sequelize = require("../../../sequelize");
const {ActionRowBuilder, SelectMenuBuilder} = require("@discordjs/builders");
const voiceChannelEmbed = require("../../components/VoiceChannelEmbed");
const userSelectMenu = require("../../components/UserSelectMenu");
const joinChannelButton = require("../../components/JoinChannelButton");

module.exports = {
	name: 'selectUser',
	type: 'simple',
	execute: async function (interaction, bot) {
		let channel = await sequelize.models.active_channels.findOne({
			where: {
				guild_id: interaction.guild.id,
				owner_id: interaction.member.id,
			}
		})

		if (!channel) {
			await interaction.reply({content: "Вы не являетесь владельцем канала!", ephemeral: true});
			return;
		}

		let punish = await sequelize.models.users_punishments.findOne({
			where: {
				guild_id: interaction.guild.id,
				voice_channel_id: channel.channel_id,
				target_id: interaction.values[0],
				status: "premuted",
			}
		})
		if(!punish)
			await sequelize.models.users_punishments.create({
				guild_id: interaction.guild.id,
				voice_channel_id: channel.channel_id,
				target_id: interaction.values[0],
				initiator_id: interaction.member.id,
				status: "created"
			})

		let row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId(`selectPunishment${interaction.values[0]}`)
					.setPlaceholder('Выберите наказание')
					.addOptions([
							{
								label: 'Выгнать из канала',
								description: 'Выгоняет пользователя из канала',
								value: 'kick',
							},
							(!punish ? {
								label: 'Замутить/Размутить',
								description: 'Мутить пользователя в канале, либо размутить, если он уже в муте',
								value: 'mute',
							} : {
								label: 'Нельзя замутить',
								description: 'Пользователь уже в муте',
								value: 'alreadymuted',
								disabled: true,
							}),
						]
					)
			)
		let server = await sequelize.models.registered_channels.findOne({
			where: {
				guild_id: interaction.guild.id,
				voice_channel_id: channel.related_voice_channel_id
			}
		});
		let message = await bot.channels.cache.get(server.text_channel_id).messages.fetch(channel.related_message_id);
		let embed = message.embeds[0];
		let channel_size = await bot.channels.cache.get(channel.channel_id).members.size;
		let max_size = await bot.channels.cache.get(channel.channel_id).userLimit;
		let r = voiceChannelEmbed.execute(bot, server.name, server.id, embed.fields[0].value, interaction.guild.name, interaction.guild.iconURL(), 0x00FF00, channel_size, max_size);
		await message.edit(
			{
				embeds: [r],
				content: `Владелец канала: <@${channel.owner_id}>`,
				components: [await userSelectMenu.execute(bot, channel.channel_id), await joinChannelButton.execute(bot, channel.channel_id)]
			});
		await interaction.reply({
			content: 'Выберите наказания для выбранного пользователя',
			components: [row],
			ephemeral: true
		});
	}
}