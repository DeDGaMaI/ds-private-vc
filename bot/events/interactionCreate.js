const serverExists = require("../actions/serverExists");
const insertServer = require("../actions/insertServer.js");

module.exports = {
	name: 'interactionCreate',
	type: 'simple',
	execute: async function(bot, interaction) {
		if (!await serverExists(interaction.guildId)) insertServer(interaction.guild.name, interaction.guild.id);

		let interactions = require("../deployInteractions.js").deploy();

		if (interaction.isCommand()) {
			try {
				bot.commands.get(interaction.commandName)(interaction, bot);
			} catch (error) {
				console.error(error);
				await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
			}
		}
		else{
			interactions.find(i => (i.type === "extended" ? interaction.customId.includes(i.name) : i.name === interaction.customId)).execute(interaction, bot);
		}
	}
}