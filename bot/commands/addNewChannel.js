const {SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder} = require('@discordjs/builders')
const {PermissionsBitField} = require("discord.js");
const sequelize = require("../../sequelize");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addnewchannel')
		.setDescription('Начать работу с ботом!'),
	execute: async function (interaction, bot) {
		bot.custom.interactions.set(interaction.id, interaction)
		if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('selectType')
						.setPlaceholder('Выберите тип канала')
						.addOptions([
							{
								label: 'Для командной игры',
								description: 'Создаёт канал канал для командной игры',
								value: 'teamplay',
							},
							{
								label: 'Для общения',
								description: 'Создаёт канал для общения',
								value: 'communicate',
							},
						]),
				);
			await sequelize.models.active_interactions.create({
				guild_id: interaction.guildId,
				channel_id: interaction.channelId,
				type: "command",
				interaction_id: interaction.id,
				status: "choosing_type"
			});
			await interaction.reply({content: '', components: [row]});
		}
		else {
			await interaction.reply({content: 'Эту команду может использовать только администратор!', ephemeral: true});
		}
	},
}
