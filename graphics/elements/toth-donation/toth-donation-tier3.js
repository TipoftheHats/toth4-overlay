(function () {
	'use strict';

	Polymer({
		is: 'toth-donation-tier3',

		ready() {
			this.tl = window.notificationTl;
			window.addEventListener('donation', e => {
				this.handleDonation(e.detail);
			});
		},

		handleDonation({type, name, amount, rawAmount}) {
			if (rawAmount < 500) {
				return;
			}

			const scoreboard = document.getElementById('scoreboard');
			const sponsors = document.getElementById('sponsors');
			const rectLeft = this.$$('.type-rect.left');
			const rectRight = this.$$('.type-rect.right');
			const moneyLeft = this.$$('.money.left');
			const moneyRight = this.$$('.money.right');
			const giftboxLeft = this.$$('.giftbox.left');
			const giftboxRight = this.$$('.giftbox.right');
			const borderLeft = this.$$('.border.left');
			const borderRight = this.$$('.border.right');

			// Fade out the sponsor graphic and scoreboard
			this.tl.to([scoreboard, sponsors], 0.33, {
				opacity: 0,
				ease: Power1.easeInOut
			});

			this.tl.call(() => {
				this.$['name-content-name'].innerHTML = name;
				this.$['name-content-amount'].innerHTML = `&nbsp;${amount}`;

				// Shrink name to fit if necessary
				const nameClientWidth = this.$['name-content-name'].clientWidth;
				const nameScrollWidth = this.$['name-content-name'].scrollWidth;
				if (nameScrollWidth > nameClientWidth) {
					TweenLite.set(this.$['name-content-name'], {scaleX: nameClientWidth / nameScrollWidth});
				} else {
					TweenLite.set(this.$['name-content-name'], {scaleX: 1});
				}

				setTimeout(() => {
					nodecg.playSound('notification_tier3');
				}, 0);
			});

			this.tl.add('enter');

			this.tl.to([rectLeft, rectRight], 0.411, {
				scaleX: 1,
				ease: Back.easeOut
			}, 'enter');

			this.tl.to([borderLeft, borderRight], 0.511, {
				scaleX: 1,
				ease: Power2.easeInOut
			}, 'enter+=0.08');

			this.tl.to(this.$['name-content'], 0.392, {
				onStart() {
					if (type === 'item') {
						giftboxLeft.style.display = 'block';
						giftboxRight.style.display = 'block';
						giftboxLeft.play();
						giftboxRight.play();
					} else {
						moneyLeft.style.display = 'block';
						moneyRight.style.display = 'block';
						moneyLeft.play();
						moneyRight.play();
					}
				},
				y: '0%',
				ease: Power2.easeInOut
			}, '-=0.08');

			return;

			// Exit
			this.tl.to(this.$.cover, 0.511, {
				scaleY: 1,
				ease: Power2.easeIn,
				onComplete: function () {
					giftboxLeft.style.display = 'none';
					giftboxRight.style.display = 'none';
					moneyLeft.style.display = 'none';
					moneyRight.style.display = 'none';
					giftboxLeft.currentTime = 0;
					giftboxRight.currentTime = 0;
					moneyLeft.currentTime = 0;
					moneyRight.currentTime = 0;
					this.$.cover.style.transformOrigin = 'top center';
				}.bind(this)
			}, '+=5');

			this.tl.set([
				rectLeft,
				rectRight,
				borderLeft,
				borderRight,
				this.$['name-content']
			], {
				clearProps: 'all'
			});

			this.tl.to(this.$.cover, 0.511, {
				scaleY: 0,
				ease: Power2.easeOut
			});

			this.tl.set([
				this.$.cover
			], {
				clearProps: 'all'
			});

			// Fade in the sponsor graphic and scoreboard
			this.tl.to([scoreboard, sponsors], 0.33, {
				opacity: 1,
				ease: Power1.easeInOut
			}, '+=0.08');

			// Time padding
			this.tl.to({}, 0.2, {});
		}
	});
})();
