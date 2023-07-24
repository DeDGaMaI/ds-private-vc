const sequelize = require("../../../sequelize");
const {PermissionsBitField} = require("discord.js");
const {ActionRowBuilder, ChannelSelectMenuBuilder} = require("@discordjs/builders");

module.exports = {
	name: 'selectText',
	type: 'simple',
	async execute(interaction, bot) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}
		let text_channel_id = interaction.values[0];

		if(!bot.guilds.cache.get(interaction.guild.id).channels.cache.get(text_channel_id).permissionsFor(bot.user.id).has(PermissionsBitField.Flags.ViewChannel)) {
			await interaction.reply({content: "Бот не может отправлять сообщения в этот канал, выберите другой или выдайте доступ боту.", ephemeral: true});
			return;
		}

		await sequelize.query(`UPDATE active_interactions
                               SET text_channel_id = '${text_channel_id}',
                                   status          = 'choosing_text_channel'
                               WHERE interaction_id = '${interaction.message.interaction.id}'`);

		const row = new ActionRowBuilder()
			.addComponents(
				new ChannelSelectMenuBuilder()
					.setCustomId('selectActiveCategory')
					.setPlaceholder('Выберите категорию')
					.setChannelTypes(['GuildCategory'])
			);
		interaction.update({content: "Выберите категорию, куда будут перемещаться созданные каналы", components: [row]});
	}
}