/* eslint-disable camelcase */
(function () {
	'use strict';

	const test = document.getElementById('send');
	const amount = document.getElementById('amount');
	const donor = document.getElementById('donor');
	const type = document.getElementById('type');

	test.addEventListener('click', () => {
		nodecg.sendMessage('testDonation', {
			rawAmount: amount.value,
			name: donor.value,
			type: type.value.toLowerCase()
		});
	});
})();
