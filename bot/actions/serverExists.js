const sequelize = require("../../sequelize");

module.exports = async (id) => {
	let res = await sequelize.models.servers.findOne({
		where: {
			id: id,
		}
	})
	return res;
}