const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Начать работу с ботом!'),
	execute: async function (interaction) {

		await interaction.reply({content: 'Используйте команду /addnewchannel!', ephemeral: true});
	},
}