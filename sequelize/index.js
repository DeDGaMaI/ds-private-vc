const { Sequelize } = require('sequelize');
const fs = require("fs")

const sequelize = new Sequelize('ds-vc', 'root', 'root', {
	host: 'localhost',
	dialect: 'mysql',
})

fs.readdir(__dirname + "/models", (err, files) => {
	files.forEach(file => {
		require(`./models/${file}`)(sequelize)
	})
})

module.exports = sequelize;