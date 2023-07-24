const {PermissionsBitField} = require("discord.js");
const sequelize = require("../../../sequelize");

module.exports = {
	name: 'moderateComChannel',
	execute: async function (bot, oldState, newState, server) {
		if (newState.channelId) {
			if (server && newState.channelId === server.voice_channel_id) {
				let channel = await bot.guilds.cache.get(newState.guild.id).channels.create({
					name: newState.member.user.username,
					type: 2,
					parent: newState.channel.parentId,
					userLimit: 1,
					permissionOverwrites: [{
						id: newState.member.user.id,
						allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers],
					}]
				});

				await sequelize.models.active_channels.create({
					guild_id: newState.guild.id,
					channel_id: channel.id,
					parent_id: newState.channel.parentId,
					owner_id: newState.member.user.id,
					type: server.type,
				});

				await newState.setChannel(channel);
			}
		} else {
			let channel = await sequelize.models.active_channels.findOne({
				where: {
					guild_id: oldState.guild.id,
					channel_id: oldState.channelId
				}
			});
			let ds_channel = await bot.channels.cache.get(channel.channel_id);
			if (ds_channel.members.size === 0) {
				await sequelize.models.active_channels.destroy({
					where: {
						guild_id: oldState.guild.id,
						channel_id: oldState.channelId
					}
				});
				await bot.guilds.cache.get(oldState.guild.id).channels.cache.get(oldState.channelId).delete();
			}
			if (oldState.member.id === channel.owner_id) {
				let random = Math.floor(Math.random() * ds_channel.members.size);
				let i = 0;
				for (let member of ds_channel.members) {
					if (i === random) {
						console.log(member[0]);
						await sequelize.query(`UPDATE active_channels
                                                   SET owner_id = ${member[0]}
                                                   WHERE guild_id = ${oldState.guild.id}
                                                     AND channel_id = ${oldState.channelId}`);
						await oldState.channel.permissionOverwrites.set([
							{
								id: member[0],
								allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers],
							},
							{
								id: channel.owner_id,
								deny: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers],
							}
						])
					}
					i++;
				}
			}
		}
	}
}