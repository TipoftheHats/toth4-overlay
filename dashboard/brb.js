(function () {
	'use strict';
	const show = document.getElementById('show');
	const hide = document.getElementById('hide');
	const input = document.getElementById('input');
	const brbShowing = nodecg.Replicant('brbShowing');
	const upNext = nodecg.Replicant('upNext');

	brbShowing.on('change', newVal => {
		if (newVal) {
			show.setAttribute('disabled', 'true');
			hide.removeAttribute('disabled');
		} else {
			show.removeAttribute('disabled');
			hide.setAttribute('disabled', 'true');
		}
	});

	show.addEventListener('click', () => {
		upNext.value = input.value;
		brbShowing.value = true;
	});

	hide.addEventListener('click', () => {
		brbShowing.value = false;
	});
})();
