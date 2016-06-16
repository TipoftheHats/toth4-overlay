'use strict';

const DONATION_STATS_URL = 'http://tracker.tipofthehats.org/2?json';
const POLL_INTERVAL = 3 * 60 * 1000;

const util = require('util');
const Q = require('q');
const request = require('request');
const numeral = require('numeral');

module.exports = function (nodecg) {
	let updateInterval;
	const total = nodecg.Replicant('total', {defaultValue: {}});
	const autoUpdateTotal = nodecg.Replicant('autoUpdateTotal', {defaultValue: true})
		.on('change', newVal => {
			if (newVal) {
				nodecg.log.info('Automatic updating of donation total enabled');
				updateTotal(true);
			} else {
				nodecg.log.warn('Automatic updating of donation total DISABLED');
				clearInterval(updateInterval);
			}
		});

	// Get initial data
	update();

	if (autoUpdateTotal.value) {
		// Get latest prize data every POLL_INTERVAL milliseconds
		nodecg.log.info('Polling donation total every %d seconds...', POLL_INTERVAL / 1000);
		updateInterval = setInterval(update, POLL_INTERVAL);
	} else {
		nodecg.log.info('Automatic update of total is disabled, will not poll until enabled');
	}

	// Dashboard can invoke manual updates
	nodecg.listenFor('updateTotal', updateTotal);

	function updateTotal(silent, cb) {
		if (!silent) {
			nodecg.log.info('Manual donation total update button pressed, invoking update...');
		}

		clearInterval(updateInterval);
		updateInterval = setInterval(update, POLL_INTERVAL);
		update()
			.then(updated => {
				if (updated) {
					nodecg.log.info('Donation total successfully updated');
				} else {
					nodecg.log.info('Donation total unchanged, not updated');
				}

				cb(null, updated);
			}, error => {
				cb(error);
			});
	}

	function update() {
		const deferred = Q.defer();
		request(DONATION_STATS_URL, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				const stats = JSON.parse(body);
				const raw = parseFloat(stats.agg.amount || 0);
				const freshTotal = numeral(raw).format('$0,0');

				if (freshTotal === total.value) {
					deferred.resolve(false);
				} else {
					total.value.raw = raw;
					total.value.formatted = freshTotal;
					deferred.resolve(true);
				}
			} else {
				let msg = 'Could not get donation total, unknown error';
				if (error) {
					msg = util.format('Could not get donation total:', error.message);
				} else if (response) {
					msg = util.format('Could not get donation total, response code %d', response.statusCode);
				}
				nodecg.log.error(msg);
				deferred.reject(msg);
			}
		});
		return deferred.promise;
	}
};
