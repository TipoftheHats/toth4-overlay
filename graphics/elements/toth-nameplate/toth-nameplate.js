(function () {
	'use strict';

	const host = nodecg.Replicant('host');
	const couch1 = nodecg.Replicant('couch1');
	const couch2 = nodecg.Replicant('couch2');
	const couch3 = nodecg.Replicant('couch3');
	const player1 = nodecg.Replicant('player1');
	const player2 = nodecg.Replicant('player2');
	const player3 = nodecg.Replicant('player3');
	const player4 = nodecg.Replicant('player4');
	const couchVisible = nodecg.Replicant('couchVisible');
	const playerVisible = nodecg.Replicant('playerVisible');

	Polymer({
		is: 'toth-nameplate',

		ready() {
			this.tl = new TimelineLite({autoRemoveChildren: true});

			host.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.host = null;
				} else {
					this.host = {};
					this.host = newVal;
				}

				if (!this._hostReady) {
					this._hostReady = true;
					this._checkReplicantsReady();
				}
			});

			couch1.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.couch1 = null;
				} else {
					this.couch1 = {};
					this.couch1 = newVal;
				}

				if (!this._couch1Ready) {
					this._couch1Ready = true;
					this._checkReplicantsReady();
				}
			});

			couch2.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.couch2 = null;
				} else {
					this.couch2 = {};
					this.couch2 = newVal;
				}

				if (!this._couch2Ready) {
					this._couch2Ready = true;
					this._checkReplicantsReady();
				}
			});

			couch3.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.couch3 = null;
				} else {
					this.couch3 = {};
					this.couch3 = newVal;
				}

				if (!this._couch3Ready) {
					this._couch3Ready = true;
					this._checkReplicantsReady();
				}
			});

			player1.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.player1 = null;
				} else {
					this.player1 = {};
					this.player1 = newVal;
				}

				if (!this._player1Ready) {
					this._player1Ready = true;
					this._checkReplicantsReady();
				}
			});

			player2.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.player2 = null;
				} else {
					this.player2 = {};
					this.player2 = newVal;
				}

				if (!this._player2Ready) {
					this._player2Ready = true;
					this._checkReplicantsReady();
				}
			});

			player3.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.player3 = null;
				} else {
					this.player3 = {};
					this.player3 = newVal;
				}

				if (!this._player3Ready) {
					this._player3Ready = true;
					this._checkReplicantsReady();
				}
			});

			player4.on('change', newVal => {
				if (!newVal.name.trim() && !newVal.info.trim()) {
					this.player4 = null;
				} else {
					this.player4 = {};
					this.player4 = newVal;
				}

				if (!this._player4Ready) {
					this._player4Ready = true;
					this._checkReplicantsReady();
				}
			});
		},

		// Only declare the "visible" replicants once all the other replicants are ready.
		_checkReplicantsReady() {
			if (this._hostReady && this._couch1Ready && this._couch2Ready && this._couch3Ready &&
				this._player1Ready && this._player2Ready && this._player3Ready && this._player4Ready) {
				console.log('all replicants ready, adding change handlers for couchVisible and playerVisible');
				couchVisible.on('change', this.couchVisibleChanged.bind(this));
				playerVisible.on('change', this.playersVisibleChanged.bind(this));
			}
		},

		couchVisibleChanged(newVal) {
			if (newVal) {
				this.tl.add('couchEnter');

				if (this.couch1 || this.couch2 || this.couch3) {
					this.tl.to(this.$.couch, 1, {
						y: 0,
						opacity: 1,
						ease: Power3.easeOut
					}, 'couchEnter+=0.1');
				}

				if (this.host) {
					this.tl.to(this.$.host, 1, {
						y: 0,
						opacity: 1,
						ease: Power3.easeOut
					}, 'couchEnter');
				}
			} else {
				this.tl.to([this.$.couch, this.$.host], 0.8, {
					y: 300,
					opacity: 0,
					ease: Power3.easeIn
				});
			}
		},

		playersVisibleChanged(newVal) {
			if (newVal) {
				if (this.player1) {
					TweenLite.to('#player1', 0.5, {
						opacity: 1
					});
				}

				if (this.player2) {
					TweenLite.to('#player2', 0.5, {
						opacity: 1
					});
				}

				if (this.player3) {
					TweenLite.to('#player3', 0.5, {
						opacity: 1
					});
				}

				if (this.player4) {
					TweenLite.to('#player4', 0.5, {
						opacity: 1
					});
				}
			} else {
				TweenLite.to([
					'#player1',
					'#player2',
					'#player3',
					'#player4'
				], 0.5, {
					opacity: 0
				});
			}
		}
	});
})();
