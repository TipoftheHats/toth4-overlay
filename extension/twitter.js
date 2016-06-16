/* eslint-disable camelcase */
'use strict';

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig) {
		nodecg.log.error('cfg/toth3-overlay.json was not found. ' +
			'This file is where the Twitter API keys are set. ' +
			'Without those, the Twitter graphic cannot function.');
		return;
	} else if (typeof nodecg.bundleConfig.twitter === 'undefined') {
		nodecg.log.error('"twitter" is not defined in cfg/toth3-overlay.json! ' +
			'This object contains other properties that are required for the Twitter graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.twitter.consumerKey === 'undefined') {
		nodecg.log.error('twitter.consumerKey is not defined in cfg/toth3-overlay.json! ' +
			'This key (obtained from your Twitter developer account) ' +
			' is required for the Twitter graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.twitter.consumerSecret === 'undefined') {
		nodecg.log.error('twitter.consumerSecret is not defined in cfg/toth3-overlay.json! ' +
			'This secret (obtained from your Twitter developer account) ' +
			' is required for the Twitter graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.twitter.accessTokenKey === 'undefined') {
		nodecg.log.error('twitter.accessTokenKey is not defined in cfg/toth3-overlay.json! ' +
			'This key (obtained from your Twitter developer account) ' +
			' is required for the Twitter graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.twitter.accessTokenSecret === 'undefined') {
		nodecg.log.error('twitter.accessTokenSecret is not defined in cfg/toth3-overlay.json! ' +
			'This secret (obtained from your Twitter developer account) ' +
			' is required for the Twitter graphic to function.');
		return;
	}

	const Twitter = require('twitter');
	const twitter = new Twitter({
		consumer_key: nodecg.bundleConfig.twitter.consumerKey,
		consumer_secret: nodecg.bundleConfig.twitter.consumerSecret,
		access_token_key: nodecg.bundleConfig.twitter.accessTokenKey,
		access_token_secret: nodecg.bundleConfig.twitter.accessTokenSecret
	});

	const tweetShowing = nodecg.Replicant('tweetShowing', {
		defaultValue: false,
		persistent: false
	});
	const tweetPulsing = nodecg.Replicant('tweetPulsing', {
		defaultValue: false,
		persistent: false
	});
	const tweet = nodecg.Replicant('tweet', {defaultValue: {}});

	nodecg.listenFor('getTweet', url => {
		const id = url.split('/').pop();
		twitter.get('statuses/show', {
			id,
			include_my_retweet: false
		}, (error, tw) => {
			if (error) {
				nodecg.log.error('Couldn\'t get tweet:', error[0].message);
				return;
			}

			tweet.value = tw;
		});
	});

	nodecg.listenFor('pulseTweet', duration => {
		// Don't stack pulses
		if (tweetPulsing.value) {
			return;
		}

		tweetShowing.value = true;
		tweetPulsing.value = true;

		// End pulse after "duration" seconds
		setTimeout(() => {
			tweetShowing.value = false;
			tweetPulsing.value = false;
		}, duration * 1000);
	});
};
