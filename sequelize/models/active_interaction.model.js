const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('active_interactions', {
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
		},
		type: {
			type: DataTypes.ENUM('command', 'active_channel'),
		},
		interaction_id: {
			type: DataTypes.BIGINT,
			unique: true,
			allowNull: false,
		},
		channel_type: {
			type: DataTypes.ENUM('teamplay', 'communicate'),
		},
		parent_id: {
			type: DataTypes.BIGINT,
		},
		voice_channel_id: {
			type: DataTypes.BIGINT,
		},
		text_channel_id: {
			type: DataTypes.BIGINT,
		},
		channel_size: {
			type: DataTypes.INTEGER,
		},
		active_parent_id: {
			type: DataTypes.BIGINT,
		},
		owner_id: {
			type: DataTypes.BIGINT,
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		status: {
			type: DataTypes.STRING
		},
	});
};