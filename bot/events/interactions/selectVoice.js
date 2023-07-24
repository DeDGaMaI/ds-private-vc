const sequelize = require("../../../sequelize");
const {PermissionsBitField} = require("discord.js");
const {ActionRowBuilder, ChannelSelectMenuBuilder} = require("@discordjs/builders");

module.exports = {
	name: 'selectVoice',
	type: 'simple',
	async execute(interaction, bot) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}
		let voice_channel_id = interaction.values[0];

		let is_exists = await sequelize.models.registered_channels.findOne({where: {voice_channel_id: voice_channel_id}});

		if (is_exists) {
			await interaction.reply({content: "Этот канал уже используется!", ephemeral: true});
			return;
		}

		await sequelize.query(`UPDATE active_interactions
                               SET voice_channel_id = '${voice_channel_id}',
                                   status           = 'choosing_text_channel'
                               WHERE interaction_id = '${interaction.message.interaction.id}'`);
		let res = await sequelize.models.active_interactions.findOne({where: {interaction_id: interaction.message.interaction.id}});
		let parent_id = bot.guilds.cache.get(interaction.guildId).channels.cache.get(voice_channel_id).parentId;
		await sequelize.models.active_interactions.update({parent_id: parent_id}, {where: {interaction_id: interaction.message.interaction.id}});
		if (res.channel_type === "communicate") {
			await sequelize.models.registered_channels.create({
				guild_id: interaction.guildId,
				voice_channel_id: voice_channel_id,
				parent_id: parent_id,
				type: res.channel_type
			});
			await interaction.update({content: "Канал успешно зарегистрирован!", components: []})
				.then(() => {
					setTimeout(async () => {
						await interaction.deleteReply()
						await sequelize.models.active_interactions.destroy({where: {interaction_id: interaction.message.interaction.id}});
					}, 5000)
				});
		} else {
			const row = new ActionRowBuilder()
				.addComponents(new ChannelSelectMenuBuilder()
					.setCustomId('selectText')
					.setPlaceholder('Выберите текстовый канал')
					.setChannelTypes(['GuildText']));
			interaction.update({content: "Выберите текстовый канал", components: [row]});
		}
	}
}