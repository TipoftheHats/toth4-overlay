/* eslint-disable object-property-newline */
'use strict';

module.exports = function (nodecg) {
	// Initialize replicants.
	nodecg.Replicant('host', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('couch1', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('couch2', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('couch3', {defaultValue: {name: '', info: ''}});

	nodecg.Replicant('player1', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('player2', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('player3', {defaultValue: {name: '', info: ''}});
	nodecg.Replicant('player4', {defaultValue: {name: '', info: ''}});

	nodecg.Replicant('couchVisible', {defaultValue: false});
	nodecg.Replicant('playerVisible', {defaultValue: false});
};
