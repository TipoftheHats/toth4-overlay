(function () {
	'use strict';

	const texts = nodecg.Replicant('texts');
	const lowerthirdShowing = nodecg.Replicant('lowerthirdShowing');

	Polymer({
		is: 'toth-lowerthird',

		properties: {
			titleMsg: {
				type: String,
				observer: 'titleMsgChanged'
			},
			bodyMsg: {
				type: String,
				observer: 'bodyMsgChanged'
			},
			absoluteMaxWidth: {
				type: Number,
				value: 1240
			},
			_showing: {
				type: Boolean,
				value: false
			}
		},

		titleMsgChanged() {
			// Limit width of title to 800 px
			const title = this.$.title;
			const maxWidth = 800;
			const titleWidth = title.scrollWidth;
			if (titleWidth > maxWidth) {
				TweenLite.set(title, {scaleX: maxWidth / titleWidth});
			} else {
				TweenLite.set(title, {scaleX: 1});
			}
		},

		bodyMsgChanged() {
			const bodyEl = this.$.body;
			bodyEl.style.maxWidth = '';
			const width = bodyEl.offsetWidth;
			if (width >= this.absoluteMaxWidth) {
				const maxHeight = parseInt(window.getComputedStyle(bodyEl).maxHeight, 10);
				bodyEl.style.maxWidth = `${width / 2}px`;
				while (bodyEl.scrollHeight > maxHeight) {
					bodyEl.style.maxWidth = `${parseInt(bodyEl.style.maxWidth, 10) + 1}px`;
					if (parseInt(bodyEl.style.maxWidth, 10) >= this.absoluteMaxWidth) {
						break;
					}
				}
				if (parseInt(bodyEl.style.maxWidth, 10) >= this.absoluteMaxWidth) {
					bodyEl.style.maxWidth = `${this.absoluteMaxWidth}px`;
				}
			}

			if (bodyEl.showing) {
				TweenLite.set(this.$.line, {
					width: Math.max(this.$.title.getBoundingClientRect().width + this.$.logo.offsetWidth,
						bodyEl.offsetWidth)
				});
			}
		},

		attached() {
			texts.on('change', newVal => {
				this.titleMsg = newVal.title;
				this.bodyMsg = newVal.body;

				if (!this._textsReady) {
					this._textsReady = true;
					this._onTextsReady();
				}
			});
		},

		// Only declare the "showing" replicant once all the "texts" replicant is ready.
		_onTextsReady() {
			lowerthirdShowing.on('change', newVal => {
				if (newVal) {
					this.show();
				} else {
					this.hide();
				}
			});
		},

		show() {
			if (this._showing) {
				return;
			}

			this._showing = true;

			const line = this.$.line;
			const logo = this.$.logo;
			const title = this.$.title;
			const body = this.$.body;
			const self = this;

			nodecg.playSound('lowerthird_in');

			TweenLite.to(line, 0.8, {
				width: Math.max(title.getBoundingClientRect().width + logo.offsetWidth, body.offsetWidth),
				ease: Power3.easeInOut,
				onUpdate() {
					const currLineWidth = line.offsetWidth;

					if (!logo.showing && currLineWidth >= logo.offsetWidth) {
						logo.showing = true;
						TweenLite.to(logo, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
					}

					if (!title.showing && currLineWidth >= title.getBoundingClientRect().width) {
						title.showing = true;
						TweenLite.to(title, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
					}

					if (!body.showing && currLineWidth >= body.offsetWidth) {
						body.showing = true;
						TweenLite.to(body, 0.5, {
							y: '0%',
							ease: Power3.easeOut
						});
					}
				},
				onComplete() {
					self.lineTween = null;
					self.showing = true;
				}
			});
		},

		hide() {
			if (!this._showing) {
				return;
			}

			this._showing = false;

			const line = this.$.line;
			const logo = this.$.logo;
			const title = this.$.title;
			const body = this.$.body;
			const self = this;
			const tl = new TimelineLite();

			nodecg.playSound('lowerthird_out');

			tl.add('start');
			tl.to(logo, 0.5, {
				y: '100%',
				ease: Power3.easeIn
			}, 'start');
			tl.to(title, 0.5, {
				y: '100%',
				ease: Power3.easeIn
			}, 'start+=0.08');
			tl.to(body, 0.5, {
				y: '-100%',
				ease: Power3.easeIn
			}, 'start+=0.16');
			tl.to(line, 0.06, {
				scaleY: '0',
				ease: Linear.easeNone
			});
			tl.set(body, {clearProps: 'transform'});
			tl.set([logo, line], {
				clearProps: 'all',
				onComplete() {
					body.showing = false;
					title.showing = false;
					logo.showing = false;
					self.showing = false;
				}
			});
		}
	});
})();
