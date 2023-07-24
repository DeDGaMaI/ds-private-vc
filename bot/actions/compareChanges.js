module.exports = {
	name: 'convertChanges',
	execute: function (oldState, newState) {
		return(oldState.serverDeaf !== newState.serverDeaf || oldState.serverMute !== newState.serverMute || oldState.selfDeaf !== newState.selfDeaf || oldState.selfMute !== newState.selfMute || oldState.selfVideo !== newState.selfVideo || oldState.streaming !== newState.streaming)
	}
}