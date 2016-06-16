(function () {
	'use strict';

	Polymer({
		is: 'toth-dotafortress-card',

		properties: {
			name: {
				type: String,
				value: '',
				observer: 'nameChanged'
			},
			playerClass: {
				type: String,
				value: ''
			},
			index: {
				type: Number,
				value: -1
			},
			classIconUrl: {
				type: String,
				computed: 'computeClassIconUrl(playerClass)'
			},
			portraitUrl: {
				type: String,
				computed: 'computePortraitUrl(playerClass, index, team)'
			},
			thumbnailUrl: {
				type: String,
				computed: 'computeThumbnailUrl(portraitUrl)'
			},
			team: {
				type: String,
				value: '',
				observer: 'teamChanged'
			},
			banned: Boolean,
			tl: {
				type: Object,
				value: new TimelineLite({autoRemoveChildren: true})
			}
		},

		nameChanged(newVal) {
			this.$.name.innerHTML = newVal || '&nbsp;';

			const name = this.$.name;
			const nameWidth = name.scrollWidth;
			const maxWidth = this._getElementContentWidth(this.$.head);
			if (nameWidth > maxWidth) {
				TweenLite.set(name, {scaleX: maxWidth / nameWidth});
			} else {
				TweenLite.set(name, {scaleX: 1});
			}
		},

		teamChanged(newVal) {
			switch (newVal) {
				case 'red':
					this.style.backgroundColor = '#F53641';
					break;
				case 'blu':
					this.style.backgroundColor = '#127FDC';
					break;
				default:
					this.style.backgroundColor = '#F47425';
			}
		},

		computeClassIconUrl(playerClass) {
			if (!playerClass) {
				return '';
			}

			return 'app/toth-dotafortress/class_icons/${playerClass}.png';
		},

		computePortraitUrl(playerClass, index, team) {
			if (index === -1) {
				return 'app/toth-dotafortress/portraits/placeholder.webm';
			}

			return `app/toth-dotafortress/portraits/${playerClass}/${playerClass}_${index}_${team || 'red'}.webm`;
		},

		computeThumbnailUrl(portraitUrl) {
			const url = portraitUrl.split('.');
			url.pop();
			url.push('jpg');
			return url.join('.');
		},

		_getElementContentWidth(element) {
			const styles = window.getComputedStyle(element);
			const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
			return element.clientWidth - padding;
		}
	});
})();
