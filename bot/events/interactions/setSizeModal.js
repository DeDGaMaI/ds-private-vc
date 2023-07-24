const sequelize = require("../../../sequelize");
const {PermissionsBitField, TextInputStyle} = require("discord.js");
const {
	ActionRowBuilder, ButtonBuilder, TextInputBuilder, ModalBuilder
} = require("@discordjs/builders");

async function sendModal(interaction, bot) {
	const row = new ActionRowBuilder()
		.addComponents(
			new TextInputBuilder()
				.setCustomId('setSize')
				.setLabel('Введите корректный размер комнаты')
				.setStyle(TextInputStyle.Short)
		);
	const modal = new ModalBuilder()
		.setTitle('Настройка комнат')
		.setCustomId('setSizeModal')
		.addComponents(row)
	interaction.showModal(modal)
	bot.custom.guilds.set(interaction.message.interaction.id, {status: 'editing_size'})
	await sequelize.models.active_interactions.update({status: "editing_size"}, {
		where: {
			guild_id: interaction.guild.id,
			interaction_id: interaction.message.interaction.id
		}
	})
}

module.exports = {
	name: 'setSizeModal',
	type: 'simple',
	async execute(interaction, bot) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}

		let active_interaction = await sequelize.models.active_interactions.findOne({where: {interaction_id: interaction.message.interaction.id}});

		if(active_interaction.status === "size_uncorrect") {
			await sendModal(interaction, bot)
			return;
		}

		let size = interaction.fields.getTextInputValue('setSize');
		if (Number.isNaN(Number(size)) || (Number(size) > 0 && Number(size) >= 99)) {
			await sequelize.models.active_interactions.update({status: "size_uncorrect"}, {where: {guild_id: interaction.guild.id, interaction_id: interaction.message.interaction.id}})
			bot.custom.guilds.set(interaction.message.interaction.id, {status: 'size_uncorrect'})
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('setSizeModal')
						.setLabel('Попробуйте еще раз')
						.setStyle('Primary')
				)
			interaction.update({content: "Введите корректное число(1-99)", components: [row]});
		}
		else {
			console.log("else");
			await sequelize.query(`UPDATE active_interactions
                                SET channel_size   = '${(size === 0) ? null : size}',
                                    status = 'choosing_name'
                                WHERE interaction_id = '${interaction.message.interaction.id}'`);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('editSizeModal')
						.setLabel('Введите название')
						.setStyle('Primary')
				)
			interaction.update({content: "Введите название чата", components: [row]});
		}
	}
}