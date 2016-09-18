/* eslint-disable object-property-newline */
'use strict';

const _PLAYERS = [
	// Scouts
	{name: 'sezco', playerClass: 'scout', index: 0, state: 'available'},
	{name: 'b4nny', playerClass: 'scout', index: 1, state: 'available'},
	{name: 'evilmrmuffinz', playerClass: 'scout', index: 2, state: 'available'},
	{name: 'vand', playerClass: 'scout', index: 3, state: 'available'},
	{name: 'corsa', playerClass: 'scout', index: 4, state: 'available'},
	{name: 'thalash', playerClass: 'scout', index: 5, state: 'available'},
	{name: 'auzzie', playerClass: 'scout', index: 6, state: 'available'},
	{name: 'smaka', playerClass: 'scout', index: 7, state: 'available'},
	{name: 'herr_p', playerClass: 'scout', index: 8, state: 'available'},

	// Soldiers
	{name: 'tagg', playerClass: 'soldier', index: 0, state: 'available'},
	{name: 'ma3la', playerClass: 'soldier', index: 1, state: 'available'},
	{name: 'paddie', playerClass: 'soldier', index: 2, state: 'available'},
	{name: 'dave_ac', playerClass: 'soldier', index: 3, state: 'available'},
	{name: 'deathy', playerClass: 'soldier', index: 4, state: 'available'},
	{name: 'blaze', playerClass: 'soldier', index: 5, state: 'available'},
	{name: 'marmadukegrylls', playerClass: 'soldier', index: 6, state: 'available'},
	{name: 'silentes', playerClass: 'soldier', index: 7, state: 'available'},
	{name: 'sideshow', playerClass: 'soldier', index: 8, state: 'available'},

	// Pyros
	{name: 'the melon lord', playerClass: 'pyro', index: 0, state: 'available'},
	{name: 'billysaurus', playerClass: 'pyro', index: 1, state: 'available'},

	// Demomen
	{name: 'Rikachu', playerClass: 'demoman', index: 0, state: 'available'},
	{name: 'Paulsen', playerClass: 'demoman', index: 1, state: 'available'},
	{name: 'Bdonski', playerClass: 'demoman', index: 2, state: 'available'},
	{name: 'habib', playerClass: 'demoman', index: 3, state: 'available'},
	{name: 'pharaoh', playerClass: 'demoman', index: 4, state: 'available'},
	{name: 'Smirre', playerClass: 'demoman', index: 5, state: 'available'},

	// Heavy
	{name: 'brick', playerClass: 'heavy', index: 0, state: 'available'},
	{name: 'Karl', playerClass: 'heavy', index: 1, state: 'available'},

	// Engineer
	{name: 'Sigafoo', playerClass: 'engineer', index: 0, state: 'available'},
	{name: 'Ender', playerClass: 'engineer', index: 1, state: 'available'},

	// Medic
	{name: 'slin', playerClass: 'medic', index: 0, state: 'available'},
	{name: 'ninjanick', playerClass: 'medic', index: 1, state: 'available'},
	{name: 'nursey', playerClass: 'medic', index: 2, state: 'available'},
	{name: 'Skye', playerClass: 'medic', index: 3, state: 'available'},
	{name: 'Admirable', playerClass: 'medic', index: 4, state: 'available'},
	{name: 'cookiejake', playerClass: 'medic', index: 5, state: 'available'},

	// Sniper
	{name: 'boar', playerClass: 'sniper', index: 0, state: 'available'},
	{name: 'BLoodSire ', playerClass: 'sniper', index: 1, state: 'available'},

	// Spy
	{name: 'stabby', playerClass: 'spy', index: 0, state: 'available'},
	{name: 'Scruff McGruff', playerClass: 'spy', index: 1, state: 'available'}
];

module.exports = function (nodecg) {
	nodecg.Replicant('df_players', {defaultValue: _PLAYERS, persistent: false});
	nodecg.Replicant('df_teams', {
		defaultValue: {
			red: [],
			blu: []
		},
		persistent: false
	});
};
