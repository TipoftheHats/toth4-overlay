(function () {
	'use strict';

	const total = nodecg.Replicant('total');

	Polymer({
		is: 'toth-donation',
		properties: {
			tag: {
				type: String,
				observer: 'tagChanged'
			},
			total: {
				type: String,
				value: ''
			},
			donorName: {
				type: String,
				value: ''
			},
			tl: {
				type: Object,
				value: new TimelineLite({autoRemoveChilren: true}),
				readOnly: true
			}
		},

		tagChanged(newVal) {
			const tl = new TimelineLite();

			// Fade out
			tl.to(this.$.tag, 0.4, {
				opacity: 0,
				ease: Power1.easeInOut
			});

			// Change content, keeping width static
			tl.call(() => {
				this.$.tag.innerText = newVal;
			});

			// Tween to new width
			// Figure out what width #name needs to ultimately be, and tween #name to it
			const oldText = this.$.tag.innerText;
			this.$.tag.innerText = newVal;
			const newWidth = this.$.tag.offsetWidth;
			this.$.tag.innerText = oldText;
			tl.to(this.$.tagContainer, 0.8, {
				width: newWidth,
				ease: Power3.easeInOut,
				autoRound: false
			});

			// Fade in
			tl.to(this.$.tag, 0.4, {
				opacity: 1,
				ease: Power1.easeInOut
			});
		},

		attached() {
			const self = this;
			this.tag = 'Total';
			this.body = this.total;

			total.on('change', newVal => {
				self._countTo(self.$.total, newVal.raw, {duration: 0.5});
			});

			nodecg.listenFor('donation', data => {
				const truncatedName = self._truncateString(data.name);

				// Change tag
				this.tl.call(() => {
					this.tag = data.amount;
				});

				// Fade out #total
				this.tl.to(this.$.total, 0.4, {
					opacity: 0,
					ease: Power1.easeInOut
				});

				// Set #name to have the name width as #total. We'll be tweening this to the final value later.
				// Then set #total's display to "none" and #name's display to "inline-block";
				this.tl.call(() => {
					const totalWidth = self.$.total.offsetWidth;
					this.$.name.style.width = `${totalWidth}px`;
					this.$.total.style.display = 'none';
					this.$.name.style.display = 'inline-block';
					this.$.name.style.opacity = 0;
				});

				// Figure out what width #name needs to ultimately be, and tween #name to it
				this.$.yardstick.innerText = truncatedName;
				const nameWidth = this.$.yardstick.offsetWidth;
				this.tl.to(this.$.name, 0.8, {
					width: nameWidth,
					ease: Power3.easeInOut,
					autoRound: false
				});

				// Set and fade in donor name
				this.tl.call(() => {
					this.$.name.innerText = truncatedName;
				});
				this.tl.to(this.$.name, 0.4, {
					opacity: 1,
					ease: Power1.easeInOut
				});

				// Change tag
				this.tl.call(() => {
					this.tag = 'Total';
				}, null, null, '+=5');

				// Fade out donor name and tween its width to once again match that of #total
				this.tl.to(this.$.name, 0.4, {
					opacity: 0,
					ease: Power1.easeInOut
				});
				this.tl.call(() => {
					this.$.yardstick.innerText = this.$.total.innerText;
					const totalWidth = this.$.yardstick.offsetWidth;
					TweenLite.to(this.$.name, 0.8, {
						width: totalWidth,
						ease: Power3.easeInOut,
						autoRound: false
					});
				});

				// Go back to showing total
				this.tl.call(() => {
					this.$.total.style.display = 'inline-block';
					this.$.name.style.display = 'none';
				}, null, null, '+=0.8');
				this.tl.to(this.$.total, 0.4, {
					opacity: 1,
					ease: Power1.easeInOut
				});

				// Kill time
				this.tl.to({}, 1, {});
			});
		},

		_countTo(node, number, opts) {
			opts = opts || {};

			// If opts.duration and opts.rate are both defined, error
			if (typeof opts.rate !== 'undefined' && typeof opts.duration !== 'undefined') {
				throw new Error('Only define either opts.rate or opts.duration, not both!');
			}

			// Set defaults
			opts.ease = opts.ease || Power1.easeOut;
			opts.rate = opts.rate || 0.02;

			// Parse the start value from the node's current text content
			let start = parseInt(numeral().unformat(node.innerText), 10);

			// If the target node's current text content can't be parsed as an int, default to zero.
			if (isNaN(start) || typeof start !== 'number') {
				start = 0;
			}

			const delta = Math.max(start - number, number - start);
			const tmp = {num: start};
			const tl = new TimelineLite();
			let last = null;

			// If a specific duration was provided, use that.
			// Else, calculate the duration based on the tickrate.
			let duration;
			if (opts.duration) {
				duration = opts.duration;
			} else {
				duration = opts.rate * delta;
			}

			tl.to(tmp, duration, {
				num: number,
				ease: opts.ease,
				roundProps: 'num',
				onUpdate() {
					// Do nothing if the number hasn't changed on this update
					if (tmp.num === last) {
						return;
					}
					last = tmp.num;

					// Update the node's textContent
					node.innerText = numeral(tmp.num).format('$0,0');
				}
			}, '0');

			return tl;
		},

		_truncateString(str) {
			return str.length > 28 ? `${str.substring(0, 28)}...` : str;
		}
	});
})();
