'use strict';

module.exports = function (nodecg) {
	// Initialize replicants.
	nodecg.Replicant('scores', {
		defaultValue: {
			red: {
				score: 0,
				tag: 'RED'
			},
			blu: {
				score: 0,
				tag: 'BLU'
			}
		}
	});

	nodecg.Replicant('showHashtag', {defaultValue: true});

	try {
		require('./lowerthird')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load lowerthird lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./total')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load total lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./donations')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load donations lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./bids')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load bids lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./nowplaying')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "now playing" lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./dotafortress')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "dotafortress" lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./twitter')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "twitter" lib:', e.stack);
		process.exit(1);
	}

	try {
		require('./x32')(nodecg);
	} catch (e) {
		nodecg.log.error('Failed to load "x32" lib:', e.stack);
		process.exit(1);
	}
};
