'use strict';

const DONATION_STATS_URL = 'http://tracker.tipofthehats.org/2?json';
const POLL_INTERVAL = 60 * 1000;
const request = require('request-promise');
let updateInterval;

module.exports = function (nodecg) {
	const total = nodecg.Replicant('total', {
		defaultValue: {
			raw: 0,
			formatted: '$0'
		}
	});

	const autoUpdateTotal = nodecg.Replicant('autoUpdateTotal', {defaultValue: true});
	autoUpdateTotal.on('change', newVal => {
		if (newVal) {
			nodecg.log.info('Automatic updating of donation total enabled');
			clearInterval(updateInterval);
			updateInterval = setInterval(update, POLL_INTERVAL);
			update(false);
		} else {
			nodecg.log.warn('Automatic updating of donation total DISABLED');
			clearInterval(updateInterval);
		}
	});

	nodecg.listenFor('setTotal', raw => {
		raw = parseFloat(raw);
		total.value = {
			raw,
			formatted: raw.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
				maximumFractionDigits: 0
			})
		};
	});

	// Dashboard can invoke manual updates
	nodecg.listenFor('updateTotal', (data, cb) => {
		update(false, cb);
	});

	/**
	 * Updates the "total" replicant with the latest value from the GDQ Tracker API.
	 * @param {Boolean} [silent=true] - If true, does not print log messages.
	 * @param {Function} [cb] - The callback to invoke after the total has been updated.
	 * @returns {undefined}
	 */
	function update(silent = true, cb = function () {}) {
		request({
			uri: DONATION_STATS_URL,
			json: true
		}).then(response => {
			const freshTotal = parseFloat(response.agg.amount || 0);

			if (freshTotal === total.value.raw) {
				if (!silent) {
					nodecg.log.info('Donation total unchanged, not updated');
				}

				cb(null, false);
				return false;
			}

			if (!silent) {
				nodecg.log.info('Donation total successfully updated');
			}

			total.value = {
				raw: freshTotal,
				formatted: freshTotal.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
					maximumFractionDigits: 0
				})
			};
			cb(null, true);
			return true;
		}).catch(err => {
			nodecg.log.error('Could not get donation total:', err);
			cb(err);
		});
	}
};
