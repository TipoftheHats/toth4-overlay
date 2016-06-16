(function () {
	'use strict';

	Polymer({
		is: 'toth-brb',

		properties: {},

		ready() {
			const self = this;

			nodecg.Replicant('brbShowing').on('change', newVal => {
				TweenLite.to(self, 0.5, {
					opacity: newVal ? 1 : 0,
					ease: Power1.easeInOut
				});
			});

			nodecg.Replicant('upNext').on('change', newVal => {
				TweenLite.to(self.$.upNext, 0.5, {
					onStart() {
						if (newVal) {
							self.$.event.innerText = newVal;
						}
					},
					opacity: newVal ? 1 : 0,
					ease: Power1.easeInOut,
					onComplete() {
						if (!newVal) {
							self.$.event.innerText = newVal;
						}
					}
				});
			});
		}
	});
})();
