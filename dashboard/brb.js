(function () {
	'use strict';
	const show = document.getElementById('show');
	const hide = document.getElementById('hide');
	const brbShowing = nodecg.Replicant('brbShowing');

	brbShowing.on('change', newVal => {
		if (newVal) {
			show.setAttribute('hidden', 'true');
			hide.removeAttribute('disabled');
		} else {
			show.removeAttribute('hidden');
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
