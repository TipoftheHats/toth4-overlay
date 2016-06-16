'use strict';

const app = require('express')();
module.exports = function (nodecg) {
	if (!nodecg.bundleConfig || !nodecg.bundleConfig.donationKey) {
		nodecg.log.error('cfg/toth3-overlay.json is missing the "donationKey" property. ' +
			'This means that we cannot receive new incoming donations, ' +
			'and that they will not be displayed in the top left corner as a result. ' +
			'The total will still be displayed.');
		return;
	}

	app.post('/toth3-overlay/donation', (req, res) => {
		if (req.query.key !== nodecg.bundleConfig.donationKey) {
			res.status(403).send('Not Authorized');
			return;
		}
		nodecg.sendMessage('donation', req.body);
		res.end();
	});

	nodecg.mount(app);
};
