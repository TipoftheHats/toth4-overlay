'use strict';

const POLL_INTERVAL = 60 * 1000;
const request = require('request-promise');

module.exports = function (nodecg) {
	const completedChallenges = [];
	let initialized = false;

	// Get initial data
	checkForCompletedChallenges();

	// Get latest challenge data every POLL_INTERVAL milliseconds
	nodecg.log.info('Polling completed challenges every %d seconds...', POLL_INTERVAL / 1000);
	setInterval(checkForCompletedChallenges, POLL_INTERVAL);

	/**
	 * Grabs the latest challenges from the Tracker.
	 * @returns {Promise} - A promise.
	 */
	function checkForCompletedChallenges() {
		return request({
			uri: nodecg.bundleConfig.useMockData ?
				'https://dl.dropboxusercontent.com/u/6089084/toth_mock/currentBids.json' :
				'http://tracker.tipofthehats.org/search',
			qs: {
				type: 'allbids',
				event: 3
			},
			json: true
		}).then(bids => {
			if (!bids) {
				return;
			}

			const challenges = bids.filter(bid => Boolean(bid.fields.goal));

			if (initialized) {
				challenges.forEach(challenge => {
					// Skip challenges that we've already acknowledged completion of.
					if (completedChallenges.indexOf(challenge.pk) >= 0) {
						return;
					}

					// Notify for new completions.
					if (parseFloat(challenge.fields.total) >= parseFloat(challenge.fields.goal)) {
						completedChallenges.push(challenge.pk);
						nodecg.sendMessage('challengeAccepted', {
							name: challenge.fields.name,
							total: parseFloat(challenge.fields.total).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							}).replace('.00', '')
						});
					}
				});
			} else {
				challenges.forEach(challenge => {
					if (parseFloat(challenge.fields.total) >= parseFloat(challenge.fields.goal)) {
						completedChallenges.push(challenge.pk);
					}
				});
				initialized = true;
			}
		}).catch(err => {
			nodecg.log.error('Could not get donation total:', err);
		});
	}
};
