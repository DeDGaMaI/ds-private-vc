const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkpermissions')
		.setDescription('Проверить права канала!')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Канал, права которого нужно проверить')
				.setRequired(true))
	,
	execute: async function (interaction) {
		if (interaction.member.id === '506449663042256899') {
			let channel = interaction.options.getChannel('channel');
			interaction.channel.send(channel.permissionsFor(interaction.guild.roles.everyone).toArray().join('\n'));
			interaction.reply({content: "blablabla", ephemeral: true});
		}
		else {
			await interaction.reply({content: 'Эту команду может использовать только администратор!', ephemeral: true});
		}
	},
}
