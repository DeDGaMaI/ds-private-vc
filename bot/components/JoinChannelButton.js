const {ActionRowBuilder, ButtonBuilder} = require("@discordjs/builders");
const {ButtonStyle} = require("discord.js");

module.exports = {
	name: 'joinChannelButton',
	execute: async function (bot, channel_id) {
		if(!bot.channels.cache.get(channel_id)) return;
		let invite = await bot.channels.cache.get(channel_id).createInvite();
		let link = `https://discord.gg/${invite.code}`
		return new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Присоединиться')
					.setStyle(ButtonStyle.Link)
					.setURL(link)
			)
	}
}