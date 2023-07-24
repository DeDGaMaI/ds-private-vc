const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('users_punishments', {
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
		},
		target_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		initiator_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		punishment_type: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.STRING,
		},
	});
};