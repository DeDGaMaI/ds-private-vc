const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('registered_channels', {
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
		voice_channel_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
		},
		text_channel_id: {
			type: DataTypes.BIGINT,
			unique: true,
		},
		parent_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		active_parent_id: {
			type: DataTypes.BIGINT,
		},
		channel_size: {
			type: DataTypes.INTEGER,
		},
		type: {
			type: DataTypes.ENUM('team', 'comunication'),
		},
	});
};