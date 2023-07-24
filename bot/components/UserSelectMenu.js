const {ActionRowBuilder, StringSelectMenuBuilder} = require("@discordjs/builders");

module.exports = {
	name: 'userSelectMenu',
	execute: async function (bot, channel_id) {
		let channel = await bot.channels.cache.get(channel_id);
		if(!channel) return;
		let members = channel.members.map(member => {
			return {
				label: member.user.username + "#" + member.user.discriminator,
				value: member.id
			}
		});
		return new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectUser')
					.setPlaceholder('Пользователь не выбран')
					.addOptions(members)
			)
	}
}