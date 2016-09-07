/* eslint-disable object-property-newline */
'use strict';

/*
 * NOTE: It is absolutely critical that the `args` param of any udpPort.send command not be null or undefined.
 * Doing so causes the osc lib to actually encode it as a null argument (,N). Instead, use an empty array ([]).
 */

const X32_UDP_PORT = 10023;
const osc = require('osc');
const singleInstance = require('../../../lib/graphics/single_instance');

module.exports = function (nodecg) {
	const PROD_MIC_CHANNELS = {
		techDirector: nodecg.bundleConfig.x32.techDirectorMicChannel,
		floorManager: nodecg.bundleConfig.x32.floorManagerMicChannel
	};

	const MIXBUSES = {
		couch: nodecg.bundleConfig.x32.couchMixBus,
		host: nodecg.bundleConfig.x32.hostMixBus,
		player1: nodecg.bundleConfig.x32.player1MixBus,
		player2: nodecg.bundleConfig.x32.player2MixBus,
		player3: nodecg.bundleConfig.x32.player3MixBus,
		player4: nodecg.bundleConfig.x32.player4MixBus
	};

	// Add leading zero to each mixbus channel, if that channel is < 10. (The X32 expects leading zeroes)
	for (const mixbus in MIXBUSES) {
		if (!{}.hasOwnProperty.call(MIXBUSES, mixbus)) {
			continue;
		}

		if (MIXBUSES[mixbus] < 10) {
			MIXBUSES[mixbus] = `0${MIXBUSES[mixbus]}`;
		}
	}

	const talkbackIntent = nodecg.Replicant('talkback_intent', {
		defaultValue: {
			techDirector: {
				couch: false,
				host: false,
				player1: false,
				player2: false,
				player3: false,
				player4: false
			},
			floorManager: {
				couch: false,
				host: false,
				player1: false,
				player2: false,
				player3: false,
				player4: false
			}
		},
		persistent: false
	});

	const talkbackStatus = nodecg.Replicant('talkback_status', {
		defaultValue: {
			techDirector: {
				couch: false,
				host: false,
				player1: false,
				player2: false,
				player3: false,
				player4: false
			},
			floorManager: {
				couch: false,
				host: false,
				player1: false,
				player2: false,
				player3: false,
				player4: false
			}
		},
		persistent: false
	});

	if (!nodecg.bundleConfig.x32 || Object.keys(nodecg.bundleConfig.x32).length === 0) {
		nodecg.log.error(`"x32" is not defined in cfg/${nodecg.bundleName}.json! ` +
			'Behringer X32 OSC integration will be disabled.');
		return;
	}

	// Turn off talkback when the page is closed
	singleInstance.on('graphicAvailable', url => {
		if (url === `/graphics/${nodecg.bundleName}/td_talkback.html`) {
			for (const target in talkbackIntent.value.techDirector) {
				if (!{}.hasOwnProperty.call(talkbackIntent.value.techDirector, target)) {
					continue;
				}

				talkbackIntent.value.techDirector[target] = false;
			}
		} else if (url === `/graphics/${nodecg.bundleName}/fm_talkback.html`) {
			for (const target in talkbackIntent.value.floorManager) {
				if (!{}.hasOwnProperty.call(talkbackIntent.value.floorManager, target)) {
					continue;
				}

				talkbackIntent.value.floorManager[target] = false;
			}
		}
	});

	const udpPort = new osc.UDPPort({
		localAddress: '0.0.0.0',
		localPort: 52361,
		remoteAddress: nodecg.bundleConfig.x32.address,
		remotePort: X32_UDP_PORT,
		metadata: true
	});

	udpPort.on('raw', buf => {
		const str = buf.toString('ascii');
		let valueBytes;

		for (const mixbus in MIXBUSES) {
			if (!{}.hasOwnProperty.call(MIXBUSES, mixbus)) {
				continue;
			}

			if (str.indexOf(`/${mixbus}MixMutes`) === 0) {
				// Start reading values from after the header
				valueBytes = buf.slice(buf.lastIndexOf(0x62) + 8);
				for (const station in PROD_MIC_CHANNELS) {
					if (!{}.hasOwnProperty.call(PROD_MIC_CHANNELS, station)) {
						continue;
					}

					const s = Boolean(valueBytes.readFloatBE((PROD_MIC_CHANNELS[station] - 1) * 4));
					talkbackStatus.value[station][mixbus] = s;
				}
			}
		}
	});

	udpPort.on('error', error => {
		nodecg.log.warn('[osc] Error:', error.stack);
	});

	udpPort.on('open', () => {
		nodecg.log.info('[osc] X32 port open');
	});

	udpPort.on('close', () => {
		nodecg.log.warn('[osc] X32 port closed');
	});

	udpPort.once('open', () => {
		talkbackIntent.on('change', newVal => {
			for (const station in newVal) {
				if (!{}.hasOwnProperty.call(newVal, station)) {
					continue;
				}

				for (const mixbus in MIXBUSES) {
					if (!{}.hasOwnProperty.call(MIXBUSES, mixbus)) {
						continue;
					}

					udpPort.send({
						address: `/ch/${PROD_MIC_CHANNELS[station]}/mix/${MIXBUSES[mixbus]}/on`,
						args: [
							{type: 's', value: newVal[station][mixbus] ? 'ON' : 'OFF'}
						]
					});
				}
			}
		});
	});

	// Open the socket.
	udpPort.open();

	renewSubscriptions();
	setInterval(renewSubscriptions, 10000);

	/**
	 * Renews subscriptions with the X32 (they expire every 10s).
	 * @returns {undefined}
	 */
	function renewSubscriptions() {
		for (const mixbus in MIXBUSES) {
			if (!{}.hasOwnProperty.call(MIXBUSES, mixbus)) {
				continue;
			}

			udpPort.send({
				address: '/batchsubscribe',
				args: [
					{type: 's', value: `/${mixbus}MixMutes`},
					{type: 's', value: `/mix/${MIXBUSES[mixbus]}/on`},
					{type: 'i', value: 0},
					{type: 'i', value: 31},
					{type: 'i', value: 1}
				]
			});
		}
	}
};
