const sequelize = require("../../../sequelize");
const {PermissionsBitField, TextInputStyle} = require("discord.js");
const {ActionRowBuilder, TextInputBuilder, ModalBuilder} = require("@discordjs/builders");

module.exports = {
	name: 'selectActiveCategory',
	type: 'simple',
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}
		let active_category_id = interaction.values[0];

		await sequelize.query(`UPDATE active_interactions
                               SET active_parent_id = '${active_category_id}',
                                   status           = 'choosing_size'
                               WHERE interaction_id = '${interaction.message.interaction.id}'`);

		const row = new ActionRowBuilder()
			.addComponents(
				new TextInputBuilder()
					.setCustomId('setSize')
					.setLabel('Введите размер комнаты')
					.setStyle(TextInputStyle.Short)
			);
		const modal = new ModalBuilder()
			.setTitle('Настройка комнат')
			.setCustomId('setSizeModal')
			.addComponents(row)
		interaction.showModal(modal)
	}
}