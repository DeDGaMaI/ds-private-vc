const {SlashCommandBuilder, ChannelSelectMenuBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('selectchannel')
		.setDescription('Выбрать канал для бота!'),
	execute: async function (interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			const row = new ActionRowBuilder()
				.addComponents(
					new ChannelSelectMenuBuilder()
						.setCustomId('selectChannel')
						.setPlaceholder('Выберите канал')
						.setChannelTypes(['GuildVoice'])
				);

			await interaction.reply({content: '', components: [row]});
		}
		else {
			await interaction.reply({content: 'Эту команду может использовать только администратор!', ephemeral: true});
		}
	},
}