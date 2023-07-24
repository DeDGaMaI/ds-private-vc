const sequelize = require("../../sequelize");

module.exports = (name, id) => {
	sequelize.models.servers.create({
		name: name,
		guild_id: id,
	});
}