'use strict';

const TimeObject = require('./classes/time-object');

module.exports = function (nodecg) {
	let timerCountdown;

	const countdownRep = nodecg.Replicant('countdown', {
		defaultValue: {
			time: new TimeObject(600),
			running: false
		},
		persistent: true
	});

	/* When the replicant is persisted to disk, it's class doesn't survive stringification.
	 * We must replace the persisted values (if any) with new class instances based on those values.
	 */

	// If the countdown was running when NodeCG last stopped, figure out how much time passed.
	if (countdownRep.value.running && countdownRep.value.time.raw && countdownRep.value.time.timestamp) {
		const lostSeconds = Math.floor((Date.now() - countdownRep.value.time.timestamp) / 1000);
		countdownRep.value.time = new TimeObject(countdownRep.value.time.raw + lostSeconds);
		timerCountdown = setInterval(tick, 1000);
	} else {
		countdownRep.value.running = false;
	}

	nodecg.listenFor('startCountdown', start);
	nodecg.listenFor('stopCountdown', stop);

	function start(startTime) {
		if (countdownRep.value.running) {
			return;
		}

		const timeObj = new TimeObject(TimeObject.parseSeconds(startTime));
		if (timeObj.raw <= 0) {
			return;
		}

		countdownRep.value.running = true;
		countdownRep.value.time = timeObj;
		timerCountdown = setInterval(tick, 1000);
	}

	function stop() {
		if (!countdownRep.value.running) {
			return;
		}

		countdownRep.value.running = false;
		clearInterval(timerCountdown);
	}

	function tick() {
		TimeObject.decrement(countdownRep.value.time);

		if (countdownRep.value.time.raw <= 0) {
			stop();
		}
	}
};
