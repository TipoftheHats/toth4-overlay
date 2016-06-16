'use strict';

const LastFmNode = require('lastfm').LastFmNode;

module.exports = function (nodecg) {
	if (!nodecg.bundleConfig) {
		nodecg.log.error('cfg/toth3-overlay.json was not found. ' +
			'This file is where the Last.fm API key and secret are set. ' +
			'Without those, the "now playing" graphic cannot function.');
		return;
	} else if (typeof nodecg.bundleConfig.lastfm === 'undefined') {
		nodecg.log.error('"lastfm" is not defined in cfg/toth3-overlay.json! ' +
			'This object contains other properties that are required for the "now playing" graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.lastfm.apiKey === 'undefined') {
		nodecg.log.error('lastfm.apiKey is not defined in cfg/toth3-overlay.json! ' +
			'This key (obtained from your Last.fm developer account) ' +
			' is required for the "now playing" graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.lastfm.secret === 'undefined') {
		nodecg.log.error('lastfm.secret is not defined in cfg/toth3-overlay.json! ' +
			'This secret (obtained from your Last.fm developer account) ' +
			'is required for the "now playing" graphic to function.');
		return;
	} else if (typeof nodecg.bundleConfig.lastfm.targetAccount === 'undefined') {
		nodecg.log.error('lastfm.targetAccount is not defined in cfg/toth3-overlay.json! ' +
			'This is the Last.fm username that you wish to pull "now playing" song data from.');
		return;
	}

	/* eslint-disable camelcase */
	const lastfm = new LastFmNode({
		api_key: nodecg.bundleConfig.lastfm.apiKey,
		secret: nodecg.bundleConfig.lastfm.secret
	});
	const trackStream = lastfm.stream(nodecg.bundleConfig.lastfm.targetAccount);
	/* eslint-enble camelcase */

	const pulsing = nodecg.Replicant('pulsing', {
		defaultValue: false,
		persistent: false
	});
	const nowPlaying = nodecg.Replicant('nowPlaying', {
		defaultValue: {},
		persistent: false
	});
	let pulseTimeout;

	nodecg.listenFor('np_pulse', pulse);
	function pulse() {
		// Don't stack pulses
		if (pulsing.value) {
			return;
		}
		pulsing.value = true;

		// Hard-coded 10 second duration
		pulseTimeout = setTimeout(() => {
			pulsing.value = false;
		}, 10 * 1000);
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
		// nodecg.log.error(error.message);
	});

	trackStream.start();
};
