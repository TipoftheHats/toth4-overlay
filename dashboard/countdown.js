(function () {
	'use strict';

	const start = document.getElementById('start');
	const stop = document.getElementById('stop');
	const timeInput = document.querySelector('time-input');
	const countdown = nodecg.Replicant('countdown');

	timeInput.addEventListener('invalid-changed', e => {
		if (e.detail.value) {
			start.setAttribute('disabled-invalid', 'true');
		} else {
			start.removeAttribute('disabled-invalid');
		}

		checkStartButton();
	});

	start.addEventListener('click', () => {
		nodecg.sendMessage('startCountdown', timeInput.value);
	});

	stop.addEventListener('click', () => {
		nodecg.sendMessage('stopCountdown');
	});

	countdown.on('change', newVal => {
		timeInput.setSeconds(newVal.time.raw);

		if (newVal.running) {
			timeInput.setAttribute('disabled', 'true');
			start.setAttribute('disabled-running', 'true');
			stop.removeAttribute('disabled');
		} else {
			timeInput.removeAttribute('disabled');
			start.removeAttribute('disabled-running');
			stop.setAttribute('disabled', 'true');
		}

		checkStartButton();
	});

	function checkStartButton() {
		if (start.hasAttribute('disabled-invalid') || start.hasAttribute('disabled-running')) {
			start.setAttribute('disabled', 'true');
		} else {
			start.removeAttribute('disabled');
		}
	}
})();
