const sequelize = require("../../../sequelize");
const {PermissionsBitField} = require("discord.js");
const {ActionRowBuilder, ChannelSelectMenuBuilder} = require("@discordjs/builders");

module.exports = {
	name: 'selectType',
	type: 'simple',
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}

		let type = interaction.values[0];

		await sequelize.query(`UPDATE active_interactions
                               SET channel_type = '${type}',
                                   status       = 'choosing_voice_channel'
                               WHERE interaction_id = '${interaction.message.interaction.id}'`);

		const row = new ActionRowBuilder()
			.addComponents(
				new ChannelSelectMenuBuilder()
					.setCustomId('selectVoice')
					.setPlaceholder('Выберите голосовой канал')
					.setChannelTypes(['GuildVoice'])
			);
		interaction.update({content: "Выберите голосовой канал", components: [row]});
	}
}