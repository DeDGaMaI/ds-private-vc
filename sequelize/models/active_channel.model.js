const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('active_channels', {
		guild_id: {
			allowNull: false,
			type: DataTypes.BIGINT,
		},
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
			primaryKey: true,
			autoIncrement: true,
		},
		channel_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		parent_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		owner_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
		},
		type: {
			type: DataTypes.ENUM('teamplay', 'communicate'),
		},
		related_voice_channel_id: {
			type: DataTypes.BIGINT,
		},
		related_message_id: {
			type: DataTypes.BIGINT,
		},
	});
};