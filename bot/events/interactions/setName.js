const sequelize = require("../../../sequelize");
const {PermissionsBitField, TextInputStyle} = require("discord.js");
const {ActionRowBuilder, TextInputBuilder, ModalBuilder, ButtonBuilder} = require("@discordjs/builders");

async function sendModal(interaction) {
	const row = new ActionRowBuilder()
		.addComponents(
			new TextInputBuilder()
				.setCustomId('setName')
				.setLabel('Введите новое название команты')
				.setStyle(TextInputStyle.Short)
		);
	const modal = new ModalBuilder()
		.setTitle('Настройка комнат')
		.setCustomId('setNameModal')
		.addComponents(row)
	interaction.showModal(modal)
	await sequelize.models.active_interactions.update({status: "editing_name"}, {
		where: {
			guild_id: interaction.guild.id,
			interaction_id: interaction.message.interaction.id
		}
	})
}

module.exports = {
	name: 'setNameModal',
	type: 'simple',
	async execute(interaction, bot) {
		console.log(bot.custom.guilds)
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
			return;
		}

		let active_interaction = await sequelize.models.active_interactions.findOne({where: {interaction_id: interaction.message.interaction.id}})

		if(active_interaction.status === "name_already_exists") {
			await sendModal(interaction, bot)
			return;
		}

		let name = interaction.fields.getTextInputValue('setName');

		let res_name_registered = await sequelize.models.registered_channels.findOne({
			where: {
				name: name,
				guild_id: interaction.guild.id
			}
		});
		let res_name_active = await sequelize.models.active_interactions.findOne({
			where: {
				name: name,
				guild_id: interaction.guild.id
			}
		});

		if (res_name_registered || res_name_active) {
			await sequelize.models.active_interactions.update({status: "name_already_exists"}, {where: {guild_id: interaction.guild.id, interaction_id: interaction.message.interaction.id}})
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('setNameModal')
						.setLabel('Попробуйте еще раз')
						.setStyle('Primary')
				);
			interaction.update({content: "Комната с таким названием уже существует! Выберите другое.", components: [row]})
		}
		else {

			await sequelize.query(`UPDATE active_interactions
                                   SET name   = '${name}',
                                       status = 'choosing_name'
                                   WHERE interaction_id = '${interaction.message.interaction.id}'`);

			interaction.update({content: "Канал зарегестрирован!", components: []}).then(async () => {
				setTimeout(async () => {
					try {
						bot.custom.interactions.get(interaction.message.interaction.id).deleteReply();
					} catch (e) {
						console.log(e);
					}
				}, 5000);
			})
			await sequelize.models.registered_channels.create({
				guild_id: interaction.guild.id,
				voice_channel_id: active_interaction.voice_channel_id,
				text_channel_id: active_interaction.text_channel_id,
				parent_id: active_interaction.parent_id,
				active_parent_id: active_interaction.active_parent_id,
				channel_size: active_interaction.channel_size,
				type: active_interaction.channel_type,
				name: name
			})
			await sequelize.models.active_interactions.destroy({where: {interaction_id: interaction.message.interaction.id}})
		}
	}
}