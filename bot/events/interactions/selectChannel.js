const sequelize = require("../../../sequelize");
const {PermissionsBitField} = require("discord.js");

module.exports = {
	name: 'selectChannel',
	type: 'simple',
	async execute(interaction, bot) {
		if (!interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}
		let channelId = interaction.values[0];
		let parentId = interaction.channel.parentId;
		await sequelize.query(`UPDATE servers
							   SET channel_id = '${channelId}',
								   parent_id  = '${parentId}'
							   WHERE id = '${interaction.guildId}'`);
		interaction.update({
			content: `Вы выбрали канал :loud_sound: *\`${bot.guilds.cache.get(interaction.guildId).channels.cache.get(channelId).name}\`*`,
			components: []
		}).then(() => {
			setTimeout(() => {
				interaction.deleteReply()
			}, 5000);
		})
	}
}