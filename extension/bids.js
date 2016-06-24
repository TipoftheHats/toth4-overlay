'use strict';

const POLL_INTERVAL = 60 * 1000;
const request = require('request-promise');
const equal = require('deep-equal');

module.exports = function (nodecg) {
	const wars = nodecg.Replicant('wars', {defaultValue: []});
	const challenges = nodecg.Replicant('challenges', {defaultValue: []});

	// Get initial data
	update();

	// Get latest bid data every POLL_INTERVAL milliseconds
	nodecg.log.info('Polling bids every %d seconds...', POLL_INTERVAL / 1000);
	let updateInterval = setInterval(update, POLL_INTERVAL);

	// Dashboard can invoke manual updates
	nodecg.listenFor('updateBids', (data, cb) => {
		nodecg.log.info('Manual bid update button pressed, invoking update...');
		clearInterval(updateInterval);
		updateInterval = setInterval(update, POLL_INTERVAL);
		update(cb).then(updated => {
			if (updated) {
				nodecg.log.info('Bids successfully updated');
			} else {
				nodecg.log.info('Bids unchanged, not updated');
			}

			cb(null, updated);
		});
	});

	/**
	 * Grabs the latest bids from the Tracker.
	 * @param {Function} [cb] - The callback to invoke after the latest bids have been fetched.
	 * @returns {Promise} - A promise.
	 */
	function update(cb = function () {}) {
		return request({
			uri: nodecg.bundleConfig.useMockData ?
				'https://dl.dropboxusercontent.com/u/6089084/toth_mock/currentBids.json' :
				'http://tracker.tipofthehats.org/search',
			qs: {
				type: 'allbids',
				feed: 'current',
				event: 3
			},
			json: true
		}).then(bids => {
			if (!bids) {
				return;
			}

			// The response from the tracker is flat. This is okay for donation incentives, but it requires
			// us to do some extra work to figure out what the options are for donation wars that have multiple
			// options.
			const parentBidsById = {};
			const childBids = [];
			bids.forEach(bid => {
				// If this bid is an option for a donation war, add it to childBids array.
				// Else, add it to the parentBidsById object.
				if (bid.fields.parent) {
					childBids.push(bid);
				} else {
					// Format the bid to clean up unneeded cruft.
					const formattedParentBid = {
						id: bid.pk,
						name: bid.fields.name,
						description: bid.fields.shortdescription || `No shortdescription for bid #${bid.pk}`,
						total: parseFloat(bid.fields.total).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						}).replace('.00', ''),
						rawTotal: bid.fields.total,
						state: bid.fields.state,
						speedrun: bid.fields.speedrun__name
					};

					// If this parent bid is not a target, that means it is a donation war that has options.
					// So, we should add an options property that is an empty array,
					// which we will fill in the next step.
					// Else, add the "goal" field to the formattedParentBid.
					if (bid.fields.istarget === false) {
						formattedParentBid.options = [];
					} else {
						formattedParentBid.goal = parseFloat(bid.fields.goal).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						}).replace('.00', '');
						formattedParentBid.goalMet = bid.fields.total >= bid.fields.goal;
					}

					parentBidsById[bid.pk] = formattedParentBid;
				}
			});

			// Now that we have a big array of all child bids (i.e., donation war options), we need
			// to assign them to their parents in the parentBidsById object.
			childBids.forEach(bid => {
				const formattedChildBid = {
					id: bid.pk,
					parent: bid.fields.parent,
					name: bid.fields.name,
					description: bid.fields.shortdescription,
					total: parseFloat(bid.fields.total).toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD'
					}).replace('.00', ''),
					rawTotal: bid.fields.total
				};

				const parent = parentBidsById[bid.fields.parent];
				if (parent) {
					parentBidsById[bid.fields.parent].options.push(formattedChildBid);
				} else {
					nodecg.log.error('Child bid #%d\'s parent (bid #%s) could not be found.' +
						' This child bid will be discarded!', bid.pk, bid.fields.parent);
				}
			});

			// Ah, but now we have to sort all these child bids by how much they have raised so far!
			// While we're at it, map all the parent bids back onto arrays, separating wars from challenges.
			const warsArray = [];
			const challengesArray = [];
			for (const id in parentBidsById) {
				if (!{}.hasOwnProperty.call(parentBidsById, id)) {
					continue;
				}

				const bid = parentBidsById[id];
				if (bid.options) {
					warsArray.push(bid);
				} else {
					challengesArray.push(bid);
					continue;
				}

				bid.options = bid.options.sort((a, b) => {
					const aTotal = a.rawTotal;
					const bTotal = b.rawTotal;
					if (aTotal > bTotal) {
						return -1;
					}
					if (aTotal < bTotal) {
						return 1;
					}
					// a must be equal to b
					return 0;
				});
			}

			// After all that, deep-compare our newly-calculated arrays against the existing values,
			// and only update the replicants if they're actually different.
			const warsEqual = equal(warsArray, wars.value);
			const challengesEqual = equal(challengesArray, challenges.value);
			if (warsEqual && challengesEqual) {
				return false;
			}

			if (!warsEqual) {
				wars.value = warsArray;
			}

			if (!challengesEqual) {
				challenges.value = challengesArray;
			}

			return true;
		}).catch(err => {
			nodecg.log.error('Could not get donation total:', err);
			cb(err);
		});
	}
};
