(function () {
	'use strict';
	const show = document.getElementById('show');
	const update = document.getElementById('update');
	const hide = document.getElementById('hide');
	const input = document.getElementById('input');
	const brbShowing = nodecg.Replicant('brbShowing');
	const upNext = nodecg.Replicant('upNext');

	upNext.on('change', newVal => {
		input.value = newVal;
	});

	brbShowing.on('change', newVal => {
		if (newVal) {
			show.setAttribute('hidden', 'true');
			update.removeAttribute('hidden');
			hide.removeAttribute('disabled');
		} else {
			show.removeAttribute('hidden');
			update.setAttribute('hidden', 'true');
			hide.setAttribute('disabled', 'true');
		}
	});

	show.addEventListener('click', () => {
		doUpdate();
		brbShowing.value = true;
	});

	update.addEventListener('click', doUpdate);

	hide.addEventListener('click', () => {
		brbShowing.value = false;
	});

	function doUpdate() {
		upNext.value = input.value;
	}
})();
