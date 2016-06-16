'use strict';

module.exports = function (nodecg) {
	const lowerthirdShowing = nodecg.Replicant('lowerthirdShowing', {
		defaultValue: false,
		persistent: false
	});

	const lowerthirdPulsing = nodecg.Replicant('lowerthirdPulsing', {
		defaultValue: false,
		persistent: false
	});

	nodecg.Replicant('texts', {
		defaultValue: {},
		persistent: false
	});

	nodecg.listenFor('pulseLowerthird', duration => {
		// Don't stack pulses
		if (lowerthirdPulsing.value) {
			return;
		}

		lowerthirdShowing.value = true;
		lowerthirdPulsing.value = true;

		// End pulse after "duration" seconds
		setTimeout(() => {
			lowerthirdShowing.value = false;
			lowerthirdPulsing.value = false;
		}, duration * 1000);
	});
};
