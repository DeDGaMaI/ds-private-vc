const sequelize = require("../../sequelize");

module.exports = (name, id) => {
	sequelize.models.servers.create({
		name: name,
		id: id,
		channel_id: null,
		parent_id: null,
	});
}