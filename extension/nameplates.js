'use strict';

module.exports = function (nodecg) {
	// Initialize replicants.
	nodecg.Replicant('host', {defaultValue: {}});
	nodecg.Replicant('couch1', {defaultValue: {}});
	nodecg.Replicant('couch2', {defaultValue: {}});
	nodecg.Replicant('couch3', {defaultValue: {}});

	nodecg.Replicant('player1', {defaultValue: {}});
	nodecg.Replicant('player2', {defaultValue: {}});
	nodecg.Replicant('player3', {defaultValue: {}});
	nodecg.Replicant('player4', {defaultValue: {}});

	nodecg.Replicant('couchVisible', {defaultValue: false});
	nodecg.Replicant('playerVisible', {defaultValue: false});
};
