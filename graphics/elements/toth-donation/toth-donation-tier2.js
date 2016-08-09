(function () {
	'use strict';

	Polymer({
		is: 'toth-donation-tier2',

		ready() {
			this.tl = window.notificationTl;
			window.addEventListener('donation', e => {
				this.handleDonation(e.detail);
			});
		},

		handleDonation({type, name, amount, rawAmount}) {
			if (rawAmount < 100 || rawAmount >= 500) {
				return;
			}

			this.tl.call(() => {
				this.$['name-content-name'].innerHTML = name;
				this.$['name-content-amount'].innerHTML = `&nbsp;${amount}`;
			});

			this.tl.add('enter');

			this.tl.to(this.$['type-rect'], 0.411, {
				scaleY: 1,
				ease: Back.easeOut
			}, 'enter');

			this.tl.set(this.$.name, {
				onStart: function () {
					if (type === 'item') {
						this.$.giftbox.style.display = 'block';
						this.$.giftbox.play();
					} else {
						this.$.money.style.display = 'block';
						this.$.money.play();
					}
				}.bind(this),
				visibility: 'visible'
			}, 'enter+=0.08');

			this.tl.to(this.$.name, 0.511, {
				x: '0%',
				ease: Power2.easeInOut
			}, 'enter+=0.08');

			this.tl.to(this.$['name-content'], 0.392, {
				y: '0%',
				ease: Power2.easeInOut,
				onComplete: function () {
					this.$.name.style.zIndex = 1;
					this.$['name-content'].style.zIndex = 2;
					this.$.shimmer.style.zIndex = 1;
					this.$['name-border'].style.zIndex = 0;
					this.$.name.style.overflow = 'visible';
				}.bind(this)
			}, '-=0.08');

			this.tl.call(() => {
				const nameWidth = this.$.name.clientWidth;
				TweenLite.to(this.$.shimmer, 1.5, {
					x: -190 - nameWidth - 28,
					ease: Power4.easeInOut
				});
			});

			// Exit
			this.tl.to(this, 0.811, {
				y: 210,
				ease: Power2.easeIn,
				onComplete: function () {
					this.$.giftbox.style.display = 'none';
					this.$.money.style.display = 'none';
				}.bind(this)
			}, '+=5');

			// Reset
			this.tl.set([
				this,
				this.$['type-rect'],
				this.$.name,
				this.$['name-content'],
				this.$.shimmer
			], {
				clearProps: 'all'
			});

			// Time padding
			this.tl.to({}, 0.2, {});
		}
	});
})();
