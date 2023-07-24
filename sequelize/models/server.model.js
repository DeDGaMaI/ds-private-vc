const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('servers', {
		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		id: {
			allowNull: false,
			type: DataTypes.INTEGER,
			unique: true,
			primaryKey: true,
			autoIncrement: true,
		},
		guild_id: {
			type: DataTypes.BIGINT,
			unique: true,
		},
	});
};