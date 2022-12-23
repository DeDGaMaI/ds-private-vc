const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('channels', {
		guild_id: {
			allowNull: false,
			type: DataTypes.BIGINT,
		},
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
			primaryKey: true,
		},
		owner_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
		},
	});
};