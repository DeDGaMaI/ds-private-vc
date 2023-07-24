const sequelize = require("../../sequelize");

module.exports = async (id) => {
	return await sequelize.models.servers.findOne({
		where: {
			guild_id: id,
		}
	})
}