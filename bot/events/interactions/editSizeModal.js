const {PermissionsBitField, TextInputStyle} = require("discord.js");
const {
	ActionRowBuilder,
	TextInputBuilder,
	ModalBuilder,
} = require("@discordjs/builders");

module.exports = {
	name: 'editSizeModal',
	type: 'simple',
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new TextInputBuilder()
					.setCustomId('setName')
					.setLabel('Введите название комнаты')
					.setStyle(TextInputStyle.Short)
			);
		const modal = new ModalBuilder()
			.setTitle('Настройка комнат')
			.setCustomId('setNameModal')
			.addComponents(row)
		interaction.showModal(modal)
	}
}