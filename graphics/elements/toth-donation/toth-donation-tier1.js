(function () {
	'use strict';

	Polymer({
		is: 'toth-donation-tier1',

		properties: {
			tl: {
				type: Object,
				value: new TimelineLite({autoRemoveChilren: true}),
				readOnly: true
			}
		},

		ready() {
			window.addEventListener('donation', e => {
				this.handleDonation(e.detail);
			});
		},

		handleDonation({type, name, amount, rawAmount}) {
			if (rawAmount >= 100) {
				return;
			}

			this.tl.call(() => {
				this.$['name-content-text'].innerHTML = `${name} <b>${amount}</b>`;
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
				ease: Power2.easeInOut
			}, '-=0.08');

			// Exit
			this.tl.to(this, 0.511, {
				y: 100,
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
				this.$['name-content']
			], {
				clearProps: 'all'
			});

			// Time padding
			this.tl.to({}, 0.2, {});
		}
	});
})();
