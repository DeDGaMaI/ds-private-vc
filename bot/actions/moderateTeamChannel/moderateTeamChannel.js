const moderateNewState = require("./moderateStates/moderateNewState");
const moderateOldState = require("./moderateStates/moderateOldState");

module.exports = {
	name: 'moderateTeamChannel',
	execute: async function (bot, oldState, newState, server, active_channel) {
		if (oldState.channelId)
			await moderateOldState.execute(bot, oldState, server, active_channel);

		if (newState.channelId)
			await moderateNewState.execute(bot, newState, server, active_channel);
	}
}