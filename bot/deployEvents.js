const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'deploy-events',
	description: 'Deploy events',
	deploy() {
		const events = [];
		const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const event = require(`./events/${file}`);
			events.push(event)
		}
		return events;
	}
}