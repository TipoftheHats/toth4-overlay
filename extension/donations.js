/* eslint-disable camelcase */
'use strict';

const request = require('request-promise');

module.exports = function (nodecg) {
	nodecg.listenFor('testDonation', data => {
		nodecg.sendMessage('donation', formatDonation(data));
	});

	if (nodecg.bundleConfig && nodecg.bundleConfig.trackerKey) {
		const app = require('express')();

		// PayPal donations from the tracker are POSTed to us as they come in, no need to fetch.
		app.post(`/${nodecg.bundleName}/donation`, (req, res) => {
			if (req.query.key !== nodecg.bundleConfig.trackerKey) {
				res.sendStatus(403);
				return;
			}

			nodecg.sendMessage('donation', formatDonation({
				name: req.body.donor__visiblename,
				rawAmount: req.body.amount,
				type: 'cash'
			}));

			res.sendStatus(200);
		});

		nodecg.mount(app);
	} else {
		nodecg.log.error(`cfg/${nodecg.bundleName}.json is missing the "trackerKey" property.` +
			'\n\tThis means that we cannot receive new incoming PayPal donations from the tracker,' +
			'\n\tand that donation notifications will not be displayed as a result.' +
			'\n\tThe total will still be displayed.');
	}

	let latestScrapDonationTime;
	if (nodecg.bundleConfig && nodecg.bundleConfig.scraptf) {
		// Initialize latestDonationTime
		request({
			uri: 'https://scrap.tf/api/fundraisers/getdonations.php',
			qs: {
				fundraiser: nodecg.bundleConfig.scraptf.fundraiserId,
				key: nodecg.bundleConfig.scraptf.apiKey,
				num: 1
			},
			json: true
		}).then(response => {
			latestScrapDonationTime = response.latest_donation;
			setInterval(fetchNewScrapDonations, 60 * 1000);
		}).catch(err => {
			nodecg.log.warn('Failed to initialize latestDonationTime from Scrap.tf:', err);
		});
	} else {
		nodecg.log.error(`cfg/${nodecg.bundleName}.json is missing the "scraptf" property. ` +
			'\n\tThis means that we cannot receive new incoming item donations from scrap.tf, ' +
			'\n\tand that they will not be displayed in the top left corner as a result.');
	}

	function fetchNewScrapDonations() {
		request({
			uri: 'https://scrap.tf/api/fundraisers/getdonations.php',
			qs: {
				fundraiser: nodecg.bundleConfig.scraptf.fundraiserId,
				key: nodecg.bundleConfig.scraptf.apiKey,
				confirmed_after: latestScrapDonationTime
			},
			json: true
		}).then(response => {
			if (!response) {
				return;
			}

			// latest_donation is zero if the response contains no donations
			if (response.latest_donation) {
				latestScrapDonationTime = response.latest_donation;
			}

			response.donations.forEach(donation => {
				nodecg.sendMessage('donation', formatDonation({
					name: donation.user.name,
					rawAmount: donation.cash_value,
					type: 'item'
				}));
			});
		}).catch(err => {
			nodecg.log.error('Failed to fetch Scrap.tf donations:', err);
		});
	}

	function formatDonation({name, rawAmount, type}) {
		// Truncate name to 30 characters
		name = name.length > 30 ? `${name.substring(0, 29)}…` : name;

		// Format amount
		let amount = parseFloat(rawAmount).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		});

		// If a whole dollar, get rid of cents
		if (amount.endsWith('.00')) {
			amount = amount.substr(0, amount.length - 3);
		}

		return {
			name,
			amount,
			rawAmount,
			type
		};
	}
};
