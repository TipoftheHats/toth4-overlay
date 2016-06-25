(function () {
	'use strict';

	const INTERVAL = 2;
	const challenges = nodecg.Replicant('challenges');
	const wars = nodecg.Replicant('wars');
	const onNow = nodecg.Replicant('onNow');
	const upNext = nodecg.Replicant('upNext');
	const total = nodecg.Replicant('total');

	Polymer({
		is: 'toth-ticker',

		ready() {
			this.tl = new TimelineLite({autoRemoveChildren: true});
			this.$['total-amount'].rawValue = 0;
			TweenLite.set(this.$.content, {y: '100%'});
			total.on('change', this.totalChanged.bind(this));
		},

		attached() {
			setTimeout(() => {
				// Start the rotation
				this.showSchedule();
			}, 1500);
		},

		totalChanged(newVal) {
			const TIME_PER_DOLLAR = 0.03;
			const totalAmountEl = this.$['total-amount'];
			const delta = newVal.raw - totalAmountEl.rawValue;
			const duration = Math.min(delta * TIME_PER_DOLLAR, 5);
			let strLen = totalAmountEl.textContent.length;
			TweenLite.to(totalAmountEl, duration, {
				rawValue: newVal.raw,
				ease: Power2.easeOut,
				onUpdate: function () {
					totalAmountEl.textContent = totalAmountEl.rawValue.toLocaleString('en-US', {
						maximumFractionDigits: 0
					});

					if (totalAmountEl.textContent.length !== strLen) {
						this.fitContent();
						strLen = totalAmountEl.textContent.length;
					}
				}.bind(this)
			});
		},

		fitContent() {
			const maxWidth = this.$.body.clientWidth - 32;
			const contentWidth = this.$.content.clientWidth;
			const delta = contentWidth - maxWidth;
			if (delta > 1) {
				TweenLite.set(this.$.content, {scaleX: maxWidth / contentWidth});
			} else {
				TweenLite.set(this.$.content, {scaleX: 1});
			}
		},

		enter() {
			this.tl.to(this.$.label, 0.8, {
				y: '0%',
				ease: Back.easeInOut.config(1.7)
			});

			this.tl.to(this.$.body, 0.66, {
				scaleX: '1',
				ease: Power3.easeInOut
			});

			this.tl.to(this.$.content, 0.66, {
				y: '0%',
				ease: Power3.easeOut
			}, '-=0.18');
		},

		exit() {
			this.tl.call(() => {
				TweenLite.to(this.$.label, 1.2, {
					x: this.$.body.clientWidth + 1,
					ease: Power3.easeInOut
				});
			}, null, null, '+=0.01');
			this.tl.to({}, 1, {});

			this.tl.set(this.$.body, {scaleX: 0});
			this.tl.set(this.$.content, {y: '100%'});

			this.tl.to(this.$.label, 0.4, {
				y: '100%',
				ease: Power3.easeIn
			}, '-=0.08');

			this.tl.set(this.$.label, {x: 0});
		},

		showSchedule() {
			this.tl.call(() => {
				this.$.content.style.width = 'auto';
				this.customStyle['--toth-ticker-content-color'] = '#f47425';
				this.updateStyles();
				this.$.label.innerText = 'ON NOW';
				this.$.content.innerHTML = onNow.value;
				this.fitContent();
			});
			this.enter();
			this.tl.to({}, INTERVAL, {});
			this.exit();

			if (upNext.value) {
				this.tl.call(() => {
					this.$.label.innerText = 'UP NEXT';
					this.$.content.innerHTML = upNext.value;
					this.fitContent();
				});
				this.enter();
				this.tl.to({}, INTERVAL, {});
				this.exit();
			}

			this.tl.call(this.showChallenges, null, this);
		},

		showChallenges() {
			if (challenges.value.length <= 0) {
				this.tl.call(this.showWars, null, this);
				return;
			}

			this.tl.call(() => {
				// Measure the width of the longest challenge text
				let maxWidth = 0;
				this.$.content.style.width = 'auto';
				challenges.value.forEach(challenge => {
					this._setChallengeContent(challenge);
					const width = this.$.content.clientWidth;
					if (width > maxWidth) {
						maxWidth = width;
					}
				});

				this.$.content.style.width = `${maxWidth}px`;
				this.customStyle['--toth-ticker-content-color'] = '#12a824';
				this.updateStyles();
				this.$.label.innerText = 'CHALLENGE';
				this._setChallengeContent(challenges.value[0]);
			});
			this.enter();
			this.tl.to({}, INTERVAL, {});

			challenges.value.slice(1).forEach(challenge => {
				this.tl.to(this.$.content, 0.4, {
					y: '100%',
					ease: Power3.easeIn
				});

				this.tl.call(this._setChallengeContent, [challenge], this);

				this.tl.to(this.$.content, 0.66, {
					y: '0%',
					ease: Power3.easeOut
				});

				this.tl.to({}, INTERVAL, {});
			});

			this.exit();

			this.tl.call(this.showWars, null, this);
		},

		showWars() {
			if (wars.value.length <= 0) {
				this.tl.call(this.showCTA, null, this);
				return;
			}

			this.tl.call(() => {
				// Measure the width of the longest war text
				let maxWidth = 0;
				this.$.content.style.width = 'auto';
				wars.value.forEach(war => {
					this._setWarContent(war);
					war.options.forEach((option, index) => {
						this._setWarOption(option, index);
						const width = this.$.content.clientWidth;
						if (width > maxWidth) {
							maxWidth = width;
						}
					});
				});

				this.$.content.style.width = `${maxWidth}px`;
				this.customStyle['--toth-ticker-content-color'] = '#7c149e';
				this.updateStyles();
				this.$.label.innerText = 'DONATION WAR';
				this._setWarContent(wars.value[0]);
				this._setWarOption(wars.value[0].options[0], 0);
			});
			this.enter();
			this.tl.to({}, INTERVAL, {});

			wars.value.forEach((war, index) => {
				if (index > 0) {
					this.tl.to(this.$.content, 0.4, {
						y: '100%',
						ease: Power3.easeIn
					});

					this.tl.call(this._setWarContent, [war], this);
					this.tl.call(this._setWarOption, [war.options[0], 0], this);

					this.tl.to(this.$.content, 0.66, {
						y: '0%',
						ease: Power3.easeOut
					});
				}

				war.options.slice(1).forEach(this._optionAnim.bind(this));

				this.tl.to({}, INTERVAL, {});
			});

			this.exit();

			this.tl.call(this.showCTA, null, this);
		},

		showCTA() {
			this.tl.to(this.$.cta, 0.66, {
				y: '0%',
				ease: Back.easeOut.config(0.9)
			});

			this.tl.to(this.$.cta, 1, {
				y: '-100%',
				ease: Back.easeInOut.config(0.9)
			}, `+=${INTERVAL}`);

			this.tl.to(this.$.cta, 0.66, {
				y: '-200%',
				ease: Back.easeIn.config(0.9)
			}, `+=${INTERVAL}`);

			this.tl.set(this.$.cta, {y: '100%'});

			this.tl.call(this.showSchedule, null, this);
		},

		_optionAnim(option, index) {
			index++;

			this.tl.to({}, INTERVAL, {});

			this.tl.call(() => {
				const b = this.$.content.querySelector('b');
				const optionAnim = new TimelineLite();
				optionAnim.to(b, 0.66, {
					y: '100%',
					ease: Power3.easeIn
				});

				optionAnim.call(this._setWarOption, [option, index], this);

				optionAnim.to(b, 0.66, {
					y: '0%',
					ease: Power3.easeOut
				});
			});

			this.tl.to({}, 1.32, {});
		},

		_setChallengeContent({description, total, goal}) {
			this.$.content.innerHTML = `${description} - <b><span style="color:#f47425">${total}</span> / ${goal}</b>`;
			this.fitContent();
		},

		_setWarContent({description}) {
			this.$.content.innerHTML = `${description}&nbsp;&nbsp;&nbsp;&nbsp;<b style="display: inline-block"></b>`;
		},

		_setWarOption({description, total}, index) {
			this.$.content.querySelector('b').innerText = `${index + 1}. ${description} - ${total}`;
			this.fitContent();
		}
	});
})();
