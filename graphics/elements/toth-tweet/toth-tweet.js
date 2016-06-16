(function () {
	'use strict';

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
				}, `+=${i * 7}`);
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

		show() {
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
		},

		ready() {
			const self = this;

			nodecg.Replicant('tweet').on('change', newVal => {
				if (!newVal || !newVal.user) {
					return;
				}

				self.avatarUrl = newVal.user.profile_image_url;
				self.name = newVal.user.name;
				self.screenName = `@${newVal.user.screen_name}`;

				let msg = newVal.text;
				newVal.entities.user_mentions.forEach(mention => {
					msg = msg.split(`@${mention.screen_name}`).join(
						`<span class="link"><s>@</s>${mention.screen_name}</span>`
					);
				});

				newVal.entities.urls.forEach(url => {
					msg = msg.split(url.url).join(`<span class="link">${url.display_url}</span>`);
				});

				newVal.entities.hashtags.forEach(hashtag => {
					if (hashtag.text.toLowerCase() === 'toth2015') {
						msg = msg.split(`#${hashtag.text}`).join(
							`<span class="link orange">#${hashtag.text}</span>`
						);
					} else {
						msg = msg.split(`#{hashtag.text}`).join(
							`<span class="link">#${hashtag.text}</span>`
						);
					}
				});

				const images = [];
				if (newVal.extended_entities) {
					newVal.extended_entities.media.forEach(medium => {
						if (medium.type === 'photo') {
							images.push(`${medium.media_url}:large`);
							msg = msg.split(medium.url).join('');
						} else {
							msg = msg.split(medium.media_url).join(`<span class="link">${medium.display_url}</span>`);
						}
					});
				}
				self.images = images;

				Polymer.dom(self.$.message).innerHTML = msg.trim();
			});

			let initialized = false;
			nodecg.Replicant('tweetShowing').on('change', newVal => {
				if (!initialized) {
					initialized = true;
					if (newVal === false) {
						return;
					}
				}

				if (newVal) {
					self.show();
				} else {
					self.hide();
				}
			});
		}
	});
})();
