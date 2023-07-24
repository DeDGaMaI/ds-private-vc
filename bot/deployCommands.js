const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'deploy-commands',
	description: 'Deploy slash commands',
	deploy() {
		const commands = [];
		const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			commands.push(command)
		}
		return commands;
	}
}