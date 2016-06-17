(function () {
	'use strict';

	const scoreboardShowing = nodecg.Replicant('scoreboardShowing');
	const scores = nodecg.Replicant('scores');

	Polymer({
		is: 'toth-scoreboard',

		properties: {
			redScore: {
				type: Number,
				value: 0,
				observer: 'redScoreChanged'
			},
			bluScore: {
				type: Number,
				value: 0,
				observer: 'bluScoreChanged'
			},
			redTag: {
				type: String,
				value: 'RED',
				observer: 'redTagChanged'
			},
			bluTag: {
				type: String,
				value: 'BLU',
				observer: 'bluTagChanged'
			},
			_initialized: {
				type: Boolean,
				value: false
			}
		},

		redScoreChanged(newVal) {
			this.changeScore(this.$$('div[team="red"] .score'), newVal);
		},

		bluScoreChanged(newVal) {
			this.changeScore(this.$$('div[team="blu"] .score'), newVal);
		},

		redTagChanged(newVal) {
			this.changeTag(this.$$('div[team="red"] .tag'), newVal);
		},

		bluTagChanged(newVal) {
			this.changeTag(this.$$('div[team="blu"] .tag'), newVal);
		},

		ready() {
			TweenLite.set(this.$.logo, {
				scale: '0',
				y: '21px'
			});
		},

		attached() {
			scores.on('change', newVal => {
				this.redScore = newVal.red.score;
				this.bluScore = newVal.blu.score;
				this.redTag = newVal.red.tag;
				this.bluTag = newVal.blu.tag;
			});

			scoreboardShowing.on('change', newVal => {
				if (newVal) {
					this.show();
				} else {
					this.hide();
				}
			});
		},

		show() {
			const lines = this.getElementsByClassName('line');
			const tagWrappers = this.getElementsByClassName('tagWrapper');
			const scores = this.getElementsByClassName('score');
			const logo = this.$.logo;
			const self = this;
			const tl = new TimelineLite();

			nodecg.playSound('scoreboard_in');

			tl.set(logo, {
				scale: '0',
				y: '21px'
			});
			tl.add('start');
			tl.to(logo, 0.6, {
				scale: '1',
				ease: Back.easeOut
			}, 'start');
			tl.to(lines, 0.8, {
				width: '100%',
				ease: Power3.easeInOut,
				onUpdate() {
					const currLineWidth = lines.item(0).offsetWidth;

					if (!self.tagsShowing && currLineWidth >= tagWrappers.item(0).offsetWidth) {
						self.tagsShowing = true;
						TweenLite.to(tagWrappers, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
						TweenLite.to(logo, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
					}

					if (!self.scoresShowing && currLineWidth >= tagWrappers.item(0).offsetWidth + scores.item(0).offsetWidth) {
						self.scoresShowing = true;
						TweenLite.to(scores, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
					}
				}
			}, 'start');
		},

		hide() {
			const wrappers = this.getElementsByClassName('wrapper');
			const tagWrappers = this.getElementsByClassName('tagWrapper');
			const scores = this.getElementsByClassName('score');
			const lines = this.getElementsByClassName('line');
			const logo = this.$.logo;
			const self = this;
			const tl = new TimelineLite();

			nodecg.playSound('scoreboard_out');

			tl.add('start');
			tl.to(wrappers.item(0), 0.5, {
				x: '100%',
				ease: Power3.easeIn
			}, 'start');
			tl.to(wrappers.item(1), 0.5, {
				x: '-100%',
				ease: Power3.easeIn
			}, 'start');
			tl.to(logo, 0.5, {
				scale: '0',
				ease: Back.easeIn
			}, 'start+=0.2');
			tl.set(tagWrappers, {clearProps: 'transform'});
			tl.set([wrappers, logo, scores, lines], {
				clearProps: 'all',
				onComplete() {
					self.scoresShowing = false;
					self.tagsShowing = false;
				}
			});
		},

		changeTag(tagEl, newValue) {
			tagEl.innerHTML = newValue;

			const bluTag = this.$$('div[team="blu"] .tag');
			const redTag = this.$$('div[team="red"] .tag');

			// Reset width of tag wrappers. We'll set it after the tags themselves are sorted
			const bluTagWrapper = bluTag.parentNode;
			const redTagWrapper = redTag.parentNode;
			bluTagWrapper.style.width = '';
			redTagWrapper.style.width = '';

			// If tag is wider than 200px, scale it down
			const maxWidth = 200;
			bluTag.style.transform = '';
			redTag.style.transform = '';

			if (bluTag.scrollWidth > bluTag.offsetWidth) {
				bluTag.style.transform = `scaleX(${bluTag.offsetWidth / bluTag.scrollWidth})`;
			}

			if (redTag.scrollWidth > redTag.offsetWidth) {
				redTag.style.transform = `scaleX(${redTag.offsetWidth / redTag.scrollWidth})`;
			}

			// Make both tag wrappers the same width
			let width = Math.max(bluTag.offsetWidth, redTag.offsetWidth);
			if (width > maxWidth) {
				width = maxWidth;
			}
			bluTagWrapper.style.width = `${width}px`;
			redTagWrapper.style.width = `${width}px`;
		},

		changeScore(scoreEl, newValue) {
			scoreEl.innerHTML = newValue;
		}
	});
})();
