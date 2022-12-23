const {
	Client, GatewayIntentBits, Collection, PermissionsBitField
} = require('discord.js');
const sequelize = require("../sequelize");
const insertServer = require("./actions/insertServer");
const serverExists = require("./actions/serverExists");
require("dotenv").config();
let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});

bot.on("guildCreate", async (guild) => {
	if (!await serverExists(interaction.guildId)) insertServer(interaction.guild.name, interaction.guild.id);
})

bot.on('ready', () => {
	bot.commands = new Collection();
	let commands = require("./deployCommands.js").deploy()
	commands.forEach(command => {
		bot.commands.set(command.data.name, command.execute);
		bot.application?.commands.create(command.data);
	});
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
	if (!await serverExists(oldState.guild.id)) insertServer(oldState.guild.name, oldState.guild.id);
	if (!await serverExists(newState.guild.id)) insertServer(newState.guild.name, newState.guild.id);

	let server = await sequelize.models.servers.findOne({where: {id: newState.guild.id}});
	if (!server) return;
	if (server.channel_id === newState.channelId) {
		if (newState.member.user.bot) return;
		let res = await sequelize.models.channels.findOne({
			where: {
				owner_id: newState.member.user.id,
				guild_id: newState.guild.id
			}
		});
		if (!res) {
			let channel = await bot.guilds.cache.get(newState.guild.id).channels.create({
				name: newState.member.user.username,
				type: 2,
				parent: newState.channel.parentId,
				userLimit: 1,
				permissionOverwrites: [{
					id: newState.member.user.id,
					allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers],
				}]
			})
			await sequelize.models.channels.create({
				guild_id: newState.guild.id,
				id: channel.id,
				owner_id: newState.member.user.id
			});
			await bot.guilds.cache.get(newState.guild.id).members.cache.get(newState.member.user.id).voice.setChannel(channel.id);
		} else {
			await bot.guilds.cache.get(newState.guild.id).members.cache.get(newState.member.user.id).voice.setChannel(res.id);
		}
	}
	if (oldState) {
		if (oldState.member.user.bot) return;
		let res = await sequelize.models.channels.findAll({
			where: {
				guild_id: newState.guild.id
			}
		});
		if (res) {
			let current_channel = null;
			res.forEach(channel => {
				if (channel.id === oldState.channelId) current_channel = channel;
			});
			if (current_channel && oldState.channel && oldState.channel.members.size === 0) {
				if (oldState.channel) {
					await bot.guilds.cache.get(oldState.guild.id).channels.cache.get(current_channel.id).delete();
					await sequelize.models.channels.destroy({
						where: {
							guild_id: newState.guild.id,
							id: current_channel.id
						}
					});
				}
			}
		}
	}
})

bot.on('channelDelete', async (channel) => {
	if (!await serverExists(channel.guild.id)) insertServer(channel.guild.name, channel.guild.id);
	let res = await sequelize.models.channels.findOne({
		where: {
			guild_id: channel.guild.id,
			id: channel.id
		}
	});
	if (res) {
		await sequelize.models.channels.destroy({
			where: {
				guild_id: channel.guild.id,
				id: channel.id
			}
		});
	}
})

bot.on('interactionCreate', async interaction => {
	if (!await serverExists(interaction.guildId)) insertServer(interaction.guild.name, interaction.guild.id);
	if (interaction.isCommand()) {
		try {
			bot.commands.get(interaction.commandName)(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
		}
	}
	if (interaction.isAnySelectMenu()) {
		if (interaction.customId === "selectChannel") {
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
				await interaction.reply({content: "У вас нет прав сделать это!", ephemeral: true});
				return;
			}
			let channelId = interaction.values[0];
			let parentId = interaction.channels.get(channelId).parentId;
			await sequelize.query(`UPDATE servers
                                   SET channel_id = '${channelId}',
                                       parent_id  = '${parentId}'
                                   WHERE id = '${interaction.guildId}'`);
			interaction.update({
				content: `Вы выбрали канал :loud_sound: *\`${interaction.channels.get(interaction.values[0]).name}\`*`,
				components: []
			}).then(() => {
				setTimeout(() => {
					interaction.deleteReply()
				}, 5000);
			})
		}
	}
})


module.exports = bot;