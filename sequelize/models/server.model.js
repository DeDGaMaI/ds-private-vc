const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('servers', {
		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		id: {
			allowNull: false,
			type: DataTypes.BIGINT,
			primaryKey: true,
			unique: true,
		},
		channel_id: {
			type: DataTypes.BIGINT,
			unique: true,
		},
	});
};