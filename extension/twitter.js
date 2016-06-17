/* eslint-disable camelcase */
'use strict';

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig || typeof nodecg.bundleConfig.twitter === 'undefined') {
		nodecg.log.error('"twitter" is not defined in cfg/toth3-overlay.json! ' +
			'This object contains other properties that are required for the Twitter graphic to function.');
		return;
	}

	const twemoji = require('twemoji');
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

	nodecg.listenFor('loadTweet', url => {
		const id = url.split('/').pop();
		twitter.get('statuses/show', {
			id,
			include_my_retweet: false
		}, (error, tw) => {
			if (error) {
				nodecg.log.error('Couldn\'t get tweet:', error[0].message);
				return;
			}

			const formattedData = {
				avatarUrl: tw.user.profile_image_url,
				name: tw.user.name,
				screenName: tw.user.screen_name,
				createdAt: tw.created_at,
				id: tw.id_str
			};

			let msg = tw.text;

			// Parse mentions
			tw.entities.user_mentions.reverse().forEach(mention => {
				const start = mention.indices[0];
				const end = mention.indices[1];
				/* eslint-disable prefer-template */
				msg = msg.substring(0, start) +
					`<span class="link">${msg.substring(start, end)}</span>` +
					msg.substring(end);
				/* eslint-enable prefer-template */
			});

			// Parse newlines
			msg = msg.replace(/\r\n/g, '<br/>');
			msg = msg.replace(/\n/g, '<br/>');

			// Parse emoji
			msg = twemoji.parse(msg);

			// Parse URLs
			tw.entities.urls.forEach(url => {
				msg = msg.split(url.url).join(`<span class="link">${url.display_url}</span>`);
			});

			// Parse hashtags
			tw.entities.hashtags.forEach(hashtag => {
				if (hashtag.text.toLowerCase() === 'toth2016') {
					msg = msg.split(`#${hashtag.text}`).join(`<span class="link orange">#${hashtag.text}</span>`);
				} else {
					msg = msg.split(`#{hashtag.text}`).join(`<span class="link">#${hashtag.text}</span>`);
				}
			});

			// Parse media (esp. images)
			const images = [];
			if (tw.extended_entities) {
				tw.extended_entities.media.forEach(medium => {
					if (medium.type === 'photo') {
						images.push(`${medium.media_url}:large`);
						msg = msg.split(medium.url).join('');
					} else {
						msg = msg.split(medium.media_url).join(`<span class="link">${medium.display_url}</span>`);
					}
				});
			}

			formattedData.images = images;
			formattedData.body = msg;

			tweet.value = formattedData;
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
