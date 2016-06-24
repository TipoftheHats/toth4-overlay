(function () {
	'use strict';

	Polymer({
		is: 'toth-sponsors',

		properties: {
			logoUrls: {
				type: Array,
				value: [
					'url("img/sponsors/ignite.png")',
					'url("img/sponsors/twitch.png")',
					'url("img/sponsors/backpacktf.png")',
					'url("img/sponsors/zowie.png")',
					'url("img/sponsors/ibp.png")',
					'url("img/sponsors/tf2outpost.png")'
				]
			},
			duration: {
				type: Number,
				value: 17
			},
			interval: {
				type: Number,
				value: 10 * 60
			},
			fadeTime: {
				type: Number,
				value: 0.5
			},
			tl: {
				type: Object,
				value: new TimelineLite({autoRemoveChildren: true})
			}
		},

		show() {
			const self = this;

			// Clear any existing tweens
			this.tl.clear();

			// Slide in from left
			this.tl.to(this, 0.6, {
				x: 0,
				ease: Power2.easeOut
			});

			// Show the first logo
			this.tl.set(this.$.currentLogo, {backgroundImage: this.logoUrls[0]});
			this.tl.to(this.$.currentLogo, this.fadeTime, {
				opacity: 1,
				ease: Power1.easeInOut
			});

			// Set up tweens for each subsequent logo
			for (let i = 1; i < this.logoUrls.length; i++) {
				// Load the next logo into #nextLogo
				this.tl.set(this.$.nextLogo, {backgroundImage: this.logoUrls[i]}, `+=${this.duration}`);

				// Crossfade from #currentLogo to #nextLogo
				this.tl.to(this.$.currentLogo, this.fadeTime, {
					opacity: 0,
					ease: Power1.easeInOut
				});
				this.tl.to(this.$.nextLogo, this.fadeTime, {
					opacity: 1,
					ease: Power1.easeInOut
				});

				// Move #nextLogo's image into #currentLogo, and reset everything else.
				this.tl.call(idx => {
					self.$.currentLogo.style.backgroundImage = self.logoUrls[idx];
					self.$.currentLogo.style.opacity = 1;
					self.$.nextLogo.style.opacity = 0;
				}, [i]);
			}

			// Hide the last logo
			this.tl.to(this.$.currentLogo, this.fadeTime, {
				opacity: 0,
				ease: Power1.easeInOut
			}, `+=${this.duration}`);

			// Slide out to left
			this.tl.to(this, 0.6, {
				x: -300,
				ease: Power2.easeIn
			});
		},

		ready() {
			TweenLite.set(this, {x: -300});

			// Show every 10 minutes
			this.show();
			setInterval(this.show.bind(this), this.interval * 1000);
		}
	});
})();
