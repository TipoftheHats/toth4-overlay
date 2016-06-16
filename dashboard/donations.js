/* eslint-disable camelcase */
(function () {
	'use strict';

	const test = document.getElementById('send');
	const amount = document.getElementById('amount');
	const donor = document.getElementById('donor');

	test.addEventListener('click', () => {
		nodecg.sendMessage('donation', {
			amount: amount.value,
			donor__visiblename: donor.value
		});
	});
})();
