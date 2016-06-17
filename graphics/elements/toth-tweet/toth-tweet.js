(function () {
	'use strict';

	const tweet = nodecg.Replicant('tweet');
	const tweetShowing = nodecg.Replicant('tweetShowing');

	Polymer({
		is: 'toth-tweet',

		properties: {
			tl: {
				type: Object,
				value: new TimelineLite({autoRemoveChildren: true}),
				readOnly: true
			},
			imagesTl: {
				type: Object,
				value: new TimelineMax(),
				readOnly: true
			},
			images: {
				type: Object,
				value() {
					return [];
				},
				observer: 'imagesChanged'
			},
			_showing: {
				type: Boolean,
				value: false
			},
			_initialized: {
				type: Boolean,
				value: false
			}
		},

		imagesChanged() {
			const self = this;

			this.imagesTl.clear();

			if (this.images.length === 0) {
				self.imagesTl.to(self.$.image, 0.5, {
					opacity: 0,
					ease: Power1.easeInOut
				});
				self.imagesTl.call(() => {
					self.$.image.src = '';
				}, null, null);
				return;
			} else if (this.images.length === 1) {
				this.imagesTl.repeat(0);
			} else {
				this.imagesTl.repeat(-1);
			}

			this.images.forEach((url, i) => {
				self.imagesTl.to(self.$.image, 0.5, {
					opacity: 0,
					ease: Power1.easeInOut
				}, `+=${i * 5}`);
				self.imagesTl.call(() => {
					self.$.image.src = '';
					self.$.image.src = url;
				}, null, null);
				self.imagesTl.to(self.$.image, 0.5, {
					opacity: 1,
					ease: Power1.easeInOut
				});
			});

			this.imagesTl.to({}, 7, {});
		},

		ready() {
			const self = this;

			tweet.on('change', newVal => {
				if (typeof newVal !== 'object') {
					return;
				}

				this.avatarUrl = newVal.avatarUrl;
				this.name = newVal.name;
				this.screenName = newVal.screenName;
				this.images = newVal.images;
				Polymer.dom(self.$.message).innerHTML = newVal.body;
			});

			tweetShowing.on('change', newVal => {
				if (newVal) {
					self.show();
				} else {
					self.hide();
				}
			});
		},

		show() {
			if (this._showing) {
				return;
			}

			this._showing = true;

			const self = this;
			nodecg.playSound('tweet_in');

			this.tl.to(this.$.line, 0.8, {
				width: '100%',
				ease: Power3.easeInOut
			});
			this.tl.to(this.$.tweetBody, 0.5, {
				onStart() {
					if (self.images.length > 0) {
						const imageIn = nodecg.playSound('image_in');
						imageIn.pan = 0.000001;
						imageIn.volume = 0.75;
					}
				},
				y: '0%',
				ease: Power3.easeOut
			});
			this.tl.to(this.$.image, 1, {
				y: '0%',
				ease: Power3.easeOut
			}, '-=0.5');
		},

		hide() {
			if (!this._showing) {
				return;
			}

			this._showing = false;

			nodecg.playSound('tweet_out');

			if (this.images.length > 0) {
				const imageOut = nodecg.playSound('image_out');
				imageOut.pan = 0.000001;
				imageOut.volume = 0.75;
			}

			this.tl.to(this.$.image, 1, {
				y: '100%',
				ease: Power3.easeInt
			});
			this.tl.to(this.$.tweetBody, 0.5, {
				y: '-100%',
				ease: Power3.easeInt
			}, '-=0.88');
			this.tl.to(this.$.line, 0.8, {
				width: '0%',
				ease: Power3.easeInOut
			});
		}
	});
})();
