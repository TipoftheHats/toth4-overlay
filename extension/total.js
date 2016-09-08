'use strict';

const POLL_INTERVAL = 60 * 1000;
const Promise = require('bluebird');
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
	 * Updates the "total" replicant with the latest value from the GDQ Tracker & Scrap.tf APIs.
	 * @param {Boolean} [silent=true] - If true, does not print log messages.
	 * @param {Function} [cb] - The callback to invoke after the total has been updated.
	 * @returns {undefined}
	 */
	function update(silent = true, cb = function () {}) {
		const trackerProimise = request({
			uri: 'http://tracker.tipofthehats.org/3?json',
			json: true
		}).then(response => {
			if (!response) {
				return;
			}

			return parseFloat(response.agg.amount || 0);
		});

		const scraptfPromise = request({
			uri: 'https://scrap.tf/api/fundraisers/getsummary.php',
			qs: {
				fundraiser: nodecg.bundleConfig.scraptf.fundraiserId,
				key: nodecg.bundleConfig.scraptf.apiKey
			},
			json: true
		}).then(response => {
			if (!response) {
				return;
			}

			return parseFloat(response.donation_total);
		});

		Promise.join(trackerProimise, scraptfPromise, (trackerTotal, scraptfTotal) => {
			const freshTotal = trackerTotal + scraptfTotal;

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
