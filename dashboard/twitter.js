(function () {
	'use strict';

	const url = document.getElementById('url');
	const load = document.getElementById('load');
	const show = document.getElementById('show');
	const hide = document.getElementById('hide');
	const seven = document.getElementById('7s');
	const fifteen = document.getElementById('15s');
	const thirty = document.getElementById('30s');
	const tweetShowing = nodecg.Replicant('tweetShowing');
	const tweetPulsing = nodecg.Replicant('tweetPulsing');

	tweetShowing.once('declared', () => {
		tweetPulsing.on('change', newVal => {
			if (tweetShowing.value && newVal) {
				hide.setAttribute('disabled', 'true');
			} else {
				hide.removeAttribute('disabled');
			}
		});
	});

	tweetShowing.on('change', newVal => {
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

	load.addEventListener('click', () => {
		nodecg.sendMessage('loadTweet', url.value);
	});

	show.addEventListener('click', () => {
		tweetShowing.value = true;
	});

	hide.addEventListener('click', () => {
		tweetShowing.value = false;
	});

	seven.addEventListener('click', handlePulseClick);
	fifteen.addEventListener('click', handlePulseClick);
	thirty.addEventListener('click', handlePulseClick);

	function handlePulseClick(e) {
		nodecg.sendMessage('pulseTweet', parseInt(e.target.getAttribute('data-duration'), 10));
	}
})();
