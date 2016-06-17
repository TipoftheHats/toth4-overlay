(function () {
	'use strict';

	const marquee = document.getElementsByTagName('marquee')[0];
	const show = document.getElementById('show');

	const pulsing = nodecg.Replicant('nowPlayingPulsing');
	pulsing.on('change', newVal => {
		if (newVal) {
			show.setAttribute('disabled', 'true');
		} else {
			show.removeAttribute('disabled');
		}
	});

	const nowPlaying = nodecg.Replicant('nowPlaying');
	nowPlaying.on('change', newVal => {
		if (newVal.artistSong) {
			marquee.innerText = newVal.artistSong;
		} else {
			marquee.innerText = 'Waiting for data...';
		}
	});

	show.addEventListener('click', () => {
		nodecg.sendMessage('pulseNowPlaying');
	});
})();
