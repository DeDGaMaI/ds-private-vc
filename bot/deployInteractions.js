const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'deploy-interactions',
	description: 'Deploy interactions',
	deploy() {
		const commands = [];
		const commandFiles = fs.readdirSync(path.join(__dirname, 'events', 'interactions')).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./events/interactions/${file}`);
			commands.push(command)
		}
		return commands;
	}
}