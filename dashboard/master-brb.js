(function () {
	'use strict';
	const show = document.getElementById('brb-show');
	const hide = document.getElementById('brb-hide');
	const brbShowing = nodecg.Replicant('brbShowing');

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
		brbShowing.value = true;
	});

	hide.addEventListener('click', () => {
		brbShowing.value = false;
	});
})();
