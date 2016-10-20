/* eslint-disable camelcase */
'use strict';

const request = require('request-promise');

module.exports = function (nodecg) {
	nodecg.listenFor('testDonation', data => {
		nodecg.sendMessage('donation', formatDonation(data));
	});

	if (nodecg.bundleConfig && nodecg.bundleConfig.donationSocketUrl) {
		const socket = require('socket.io-client')(nodecg.bundleConfig.donationSocketUrl);
		socket.on('connect', () => {
			nodecg.log.info('Connected to cash donation socket', nodecg.bundleConfig.donationSocketUrl);
		});
		socket.on('connect_error', err => {
			nodecg.log.error('Donation socket connect_error:', err);
		});
		socket.on('donation', data => {
			nodecg.sendMessage('donation', formatDonation(data));
		});
		socket.on('disconnect', () => {
			nodecg.log.error('Disconnected from cash donation socket, can not receive cash donations!');
		});
		socket.on('error', err => {
			nodecg.log.error('Donation socket error:', err);
		});
	} else {
		nodecg.log.error(`cfg/${nodecg.bundleName}.json is missing the "donationSocketUrl" property.` +
			'\n\tThis means that we cannot receive new incoming PayPal donations from the tracker,' +
			'\n\tand that donation notifications will not be displayed as a result.' +
			'\n\tThe total will still be displayed.');
	}

	let latestScrapDonationTime;
	if (nodecg.bundleConfig && nodecg.bundleConfig.scraptf) {
		// Initialize latestDonationTime
		request({
			uri: 'https://dev.scrap.tf/api/fundraisers/getdonations.php',
			qs: {
				fundraiser: nodecg.bundleConfig.scraptf.fundraiserId,
				key: nodecg.bundleConfig.scraptf.apiKey,
				num: 1
			},
			json: true
		}).then(response => {
			latestScrapDonationTime = response.latest_donation;
			setInterval(fetchNewScrapDonations, 10 * 1000);
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
			uri: 'https://dev.scrap.tf/api/fundraisers/getdonations.php',
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

			if (typeof response !== 'object') {
				return;
			}

			// latest_donation is zero if the response contains no donations
			if (response.latest_donation) {
				latestScrapDonationTime = response.latest_donation;
			}

			if (response.donations) {
				response.donations.forEach(donation => {
					nodecg.sendMessage('donation', formatDonation({
						name: donation.user.name,
						rawAmount: donation.cash_value,
						type: 'item'
					}));
				});
			}
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
