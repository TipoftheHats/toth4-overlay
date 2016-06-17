'use strict';

const LastFmNode = require('lastfm').LastFmNode;

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig || typeof nodecg.bundleConfig.lastfm === 'undefined') {
		nodecg.log.error(`"lastfm" is not defined in cfg/${nodecg.bundleName}.json! ` +
			'This object contains other properties that are required for the "now playing" graphic to function.');
		return;
	}

	/* eslint-disable camelcase */
	const lastfm = new LastFmNode({
		api_key: nodecg.bundleConfig.lastfm.apiKey,
		secret: nodecg.bundleConfig.lastfm.secret
	});
	const trackStream = lastfm.stream(nodecg.bundleConfig.lastfm.targetAccount);
	/* eslint-enble camelcase */

	const pulsing = nodecg.Replicant('nowPlayingPulsing', {
		defaultValue: false,
		persistent: false
	});
	const nowPlaying = nodecg.Replicant('nowPlaying', {
		defaultValue: {},
		persistent: false
	});
	let pulseTimeout;

	nodecg.listenFor('pulseNowPlaying', pulse);
	function pulse() {
		// Don't stack pulses
		if (pulsing.value) {
			return;
		}
		pulsing.value = true;

		// Hard-coded 12 second duration
		pulseTimeout = setTimeout(() => {
			pulsing.value = false;
		}, 12 * 1000);
	}

	trackStream.on('nowPlaying', track => {
		nowPlaying.value = {
			artist: track.artist['#text'],
			song: track.name,
			album: track.album['#text'],
			cover: track.image[2]['#text'],
			artistSong: `${track.artist['#text']} - ${track.name}`
		};

		// If the graphic is already showing, end it prematurely and show the new song
		if (pulsing.value) {
			clearTimeout(pulseTimeout);
			pulsing.value = false;
		}

		// Show the graphic
		pulse();
	});

	trackStream.on('error', () => {
		// Just ignore it, this lib generates tons of errors.
	});

	trackStream.start();
};
