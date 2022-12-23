const {SlashCommandBuilder, ChannelSelectMenuBuilder, EmbedBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Узнайте, что может этот бот!'),
	execute: async function (interaction) {
		const row = new EmbedBuilder()
			.setTitle('Помощь')
			.setDescription("Этот бот может:\n" +
				"1. Создавать каналы для пользователей\n" +
				"2. Удалять каналы, если пользователь вышел из голосового канала\n" +
				"3. Перемещать пользователей в каналы, если они вышли из голосового канала\n\n" +
				"Как это работает?\n" +
				"1. Создайте канал для бота\n" +
				"2. Дайте боту права на управление каналами и перемещение участников\n" +
				"3. Выберите канал для бота с помощью команды /selectchannel\n" +
				"4. Наслаждайтесь!\n")
			.setColor(0x00ff00)
			.setTimestamp()
			.setFooter({text: "Made by Liquit"})

		await interaction.reply({content: '', embeds: [row], ephemeral: true});
	},
}