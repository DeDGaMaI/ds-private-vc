const {EmbedBuilder} = require("discord.js");

module.exports = {
	name: 'VoiceChanelEmbed',
	execute: function (bot, serverName, serverId, fields, guildName, guildIcon, color, size, max_size) {
		return new EmbedBuilder()
			.addFields(
				{
					name: `${serverName} ${serverId} (${size}/${max_size})`,
					value: `${fields}`,
					inline: false
				},
			)
			.setColor(color)
			.setFooter({text: `${guildName}`, iconURL: `${guildIcon}`});
	}
}