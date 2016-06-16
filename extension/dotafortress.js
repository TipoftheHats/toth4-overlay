/* eslint-disable object-property-newline */
'use strict';

const _PLAYERS = [
	// Scouts
	{name: 'scout0', playerClass: 'scout', index: 0, state: 'available'},
	{name: 'scout1', playerClass: 'scout', index: 1, state: 'available'},
	{name: 'scout2', playerClass: 'scout', index: 2, state: 'available'},
	{name: 'scout3', playerClass: 'scout', index: 3, state: 'available'},
	{name: 'scout4', playerClass: 'scout', index: 4, state: 'available'},
	{name: 'scout5', playerClass: 'scout', index: 5, state: 'available'},
	{name: 'scout6', playerClass: 'scout', index: 6, state: 'available'},
	{name: 'scout7', playerClass: 'scout', index: 7, state: 'available'},
	{name: 'scout8', playerClass: 'scout', index: 8, state: 'available'},

	// Soldiers
	{name: 'soldier0', playerClass: 'soldier', index: 0, state: 'available'},
	{name: 'soldier1', playerClass: 'soldier', index: 1, state: 'available'},
	{name: 'soldier2', playerClass: 'soldier', index: 2, state: 'available'},
	{name: 'soldier3', playerClass: 'soldier', index: 3, state: 'available'},
	{name: 'soldier4', playerClass: 'soldier', index: 4, state: 'available'},
	{name: 'soldier5', playerClass: 'soldier', index: 5, state: 'available'},
	{name: 'soldier6', playerClass: 'soldier', index: 6, state: 'available'},
	{name: 'soldier7', playerClass: 'soldier', index: 7, state: 'available'},
	{name: 'soldier8', playerClass: 'soldier', index: 8, state: 'available'},

	// Pyros
	{name: 'pyro0', playerClass: 'pyro', index: 0, state: 'available'},
	{name: 'pyro1', playerClass: 'pyro', index: 1, state: 'available'},

	// Demomen
	{name: 'demoman0', playerClass: 'demoman', index: 0, state: 'available'},
	{name: 'demoman1', playerClass: 'demoman', index: 1, state: 'available'},
	{name: 'demoman2', playerClass: 'demoman', index: 2, state: 'available'},
	{name: 'demoman3', playerClass: 'demoman', index: 3, state: 'available'},
	{name: 'demoman4', playerClass: 'demoman', index: 4, state: 'available'},
	{name: 'demoman5', playerClass: 'demoman', index: 5, state: 'available'},

	// Heavy
	{name: 'heavy0', playerClass: 'heavy', index: 0, state: 'available'},
	{name: 'heavy1', playerClass: 'heavy', index: 1, state: 'available'},

	// Engineer
	{name: 'engineer0', playerClass: 'engineer', index: 0, state: 'available'},
	{name: 'engineer1', playerClass: 'engineer', index: 1, state: 'available'},

	// Medic
	{name: 'medic0', playerClass: 'medic', index: 0, state: 'available'},
	{name: 'medic1', playerClass: 'medic', index: 1, state: 'available'},
	{name: 'medic2', playerClass: 'medic', index: 2, state: 'available'},
	{name: 'medic3', playerClass: 'medic', index: 3, state: 'available'},
	{name: 'medic4', playerClass: 'medic', index: 4, state: 'available'},
	{name: 'medic5', playerClass: 'medic', index: 5, state: 'available'},

	// Sniper
	{name: 'sniper0', playerClass: 'sniper', index: 0, state: 'available'},
	{name: 'sniper1', playerClass: 'sniper', index: 1, state: 'available'},

	// Spy
	{name: 'spy0', playerClass: 'spy', index: 0, state: 'available'},
	{name: 'spy1', playerClass: 'spy', index: 1, state: 'available'}
];

module.exports = function (nodecg) {
	nodecg.Replicant('df_players', {defaultValue: _PLAYERS, persistent: false});
	nodecg.Replicant('df_teams', {defaultValue: {red: [], blu: []}, persistent: false});
};
