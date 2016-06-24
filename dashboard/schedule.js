(function () {
	'use strict';

	const onNow = nodecg.Replicant('onNow');
	const upNext = nodecg.Replicant('upNext');
	const onNowInput = document.getElementById('onNow');
	const upNextInput = document.getElementById('upNext');
	const onNowMonitor = document.getElementById('monitor-onNow');
	const upNextMonitor = document.getElementById('monitor-upNext');
	const take = document.getElementById('take');

	onNow.on('change', newVal => {
		onNowMonitor.innerText = newVal;
	});

	upNext.on('change', newVal => {
		upNextMonitor.innerText = newVal;
	});

	take.addEventListener('click', () => {
		onNow.value = onNowInput.value;
		upNext.value = upNextInput.value;
	});
})();
