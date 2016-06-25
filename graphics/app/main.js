(function () {
	'use strict';

	nodecg.Replicant('mainShowing', {defaultValue: true}).on('change', newVal => {
		if (newVal) {
			TweenLite.to(document.body, 0.6, {
				opacity: 1,
				ease: Power1.easeInOut
			});
		} else {
			TweenLite.to(document.body, 0.6, {
				opacity: 0,
				ease: Power1.easeInOut
			});
		}
	});

	nodecg.Replicant('showHashtag').on('change', newVal => {
		const hashtag = document.getElementById('hashtag');
		if (newVal) {
			TweenLite.to(hashtag, 0.6, {
				opacity: 0.5,
				ease: Power1.easeInOut
			});
		} else {
			TweenLite.to(hashtag, 0.6, {
				opacity: 0,
				ease: Power1.easeInOut
			});
		}
	});
})();
