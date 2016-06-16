(function () {
	'use strict';

	const title = document.getElementById('title');
	const body = document.getElementById('body');
	const show = document.getElementById('show');
	const hide = document.getElementById('hide');
	const seven = document.getElementById('7s');
	const fifteen = document.getElementById('15s');
	const thirty = document.getElementById('30s');
	const texts = nodecg.Replicant('texts');
	const lowerthirdShowing = nodecg.Replicant('lowerthirdShowing');
	const lowerthirdPulsing = nodecg.Replicant('lowerthirdPulsing');

	lowerthirdShowing.once('declared', () => {
		lowerthirdPulsing.on('change', newVal => {
			if (lowerthirdShowing.value && newVal) {
				hide.setAttribute('disabled', 'true');
			} else {
				hide.removeAttribute('disabled');
			}
		});
	});

	lowerthirdShowing.on('change', newVal => {
		if (newVal) {
			show.setAttribute('disabled', 'true');
			seven.setAttribute('disabled', 'true');
			fifteen.setAttribute('disabled', 'true');
			thirty.setAttribute('disabled', 'true');
			hide.removeAttribute('disabled');
		} else {
			show.removeAttribute('disabled');
			seven.removeAttribute('disabled');
			fifteen.removeAttribute('disabled');
			thirty.removeAttribute('disabled');
			hide.setAttribute('disabled', 'true');
		}
	});

	show.addEventListener('click', () => {
		texts.value = {
			title: title.value,
			body: body.value
		};
		lowerthirdShowing.value = true;
	});

	hide.addEventListener('click', () => {
		lowerthirdShowing.value = false;
	});

	seven.addEventListener('click', handlePulseClick);
	fifteen.addEventListener('click', handlePulseClick);
	thirty.addEventListener('click', handlePulseClick);

	function handlePulseClick(e) {
		nodecg.sendMessage('pulseLowerthird', parseInt(e.target.getAttribute('data-duration'), 10));
	}
})();
