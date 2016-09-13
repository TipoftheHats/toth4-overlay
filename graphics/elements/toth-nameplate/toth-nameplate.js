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
			host.on('change', newVal => {
				this.host = {};
				this.host = newVal;

				if (!this._hostReady) {
					this._hostReady = true;
					this._checkReplicantsReady();
				}
			});

			couch1.on('change', newVal => {
				this.couch1 = {};
				this.couch1 = newVal;

				if (!this._couch1Ready) {
					this._couch1Ready = true;
					this._checkReplicantsReady();
				}
			});

			couch2.on('change', newVal => {
				this.couch2 = {};
				this.couch2 = newVal;

				if (!this._couch2Ready) {
					this._couch2Ready = true;
					this._checkReplicantsReady();
				}
			});

			couch3.on('change', newVal => {
				this.couch3 = {};
				this.couch3 = newVal;

				if (!this._couch3Ready) {
					this._couch3Ready = true;
					this._checkReplicantsReady();
				}
			});

			player1.on('change', newVal => {
				this.player1 = {};
				this.player1 = newVal;

				if (!this._player1Ready) {
					this._player1Ready = true;
					this._checkReplicantsReady();
				}
			});

			player2.on('change', newVal => {
				this.player2 = {};
				this.player2 = newVal;

				if (!this._player2Ready) {
					this._player2Ready = true;
					this._checkReplicantsReady();
				}
			});

			player3.on('change', newVal => {
				this.player3 = {};
				this.player3 = newVal;

				if (!this._player3Ready) {
					this._player3Ready = true;
					this._checkReplicantsReady();
				}
			});

			player4.on('change', newVal => {
				this.player4 = {};
				this.player4 = newVal;

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
			console.log('couchVisibleChanged, newVal:', newVal);

			if (newVal) {
				// couch potatoes
				if (this.couch1) {
					TweenLite.to('#couch1', 0.5, {
						width: '400px',
						opacity: 1
					});
				}

				if (this.couch2) {
					TweenLite.to('#couch2', 0.5, {
						width: '400px',
						opacity: 1
					});
				}

				if (this.couch3) {
					TweenLite.to('#couch3', 0.5, {
						width: '400px',
						opacity: 1
					});
				}

				// host
				if (this.host) {
					TweenLite.to('#host', 0.5, {
						width: '400px',
						opacity: 1
					});
				}

				const t1 = new TimelineLite();
				if (this.couch1 && this.couch2 && this.couch3) {
					t1.to('#bignamebar', 0.4, {left: 0}, 0);
					t1.to('#orangeline1', 0.4, {left: -1}, 0.2);
					t1.to('#biginfobar', 0.3, {left: 0}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -7}, 0.9);
				} else if ((this.couch1 && this.couch2 && !this.couch3) || (this.couch1 && !this.couch2 && this.couch3) || (!this.couch1 && this.couch2 && this.couch3)) {
					t1.to('#bignamebar', 0.4, {left: -400}, 0);
					t1.to('#orangeline1', 0.4, {left: -401}, 0.2);
					t1.to('#biginfobar', 0.3, {left: -400}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -407}, 0.9);
				} else if ((this.couch1 && !this.couch2 && !this.couch3) || (!this.couch1 && this.couch2 && !this.couch3) || (!this.couch1 && !this.couch2 && this.couch3)) {
					t1.to('#bignamebar', 0.4, {left: -800}, 0);
					t1.to('#orangeline1', 0.4, {left: -801}, 0.2);
					t1.to('#biginfobar', 0.3, {left: -800}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -807}, 0.9);
				}

				if (this.host) {
					t1.to('#hostnamebar', 0.4, {right: -1920}, 0);
					t1.to('#orangehostline1', 0.4, {right: -1920}, 0.2);
					t1.to('#hostinfobar', 0.3, {right: -1920}, 0.7);
					t1.to('#orangehostline2', 0.3, {right: -1920}, 0.9);
				}
			} else {
				if (this.couch1) {
					TweenLite.to('#couch1', 0.1, {
						opacity: 0,
						width: '0'
					});
				}

				if (this.couch2) {
					TweenLite.to('#couch2', 0.1, {
						opacity: 0,
						width: '0'

					});
				}

				if (this.couch3) {
					TweenLite.to('#couch3', 0.1, {
						opacity: 0,
						width: '0'
					});
				}

				if (this.host) {
					TweenLite.to('#host', 0.1, {
						opacity: 0,
						width: '0'
					});
				}

				const t1 = new TimelineLite();
				t1.to('#bignamebar', 0.3, {left: -1400}, 0.5);
				t1.to('#orangeline1', 0.3, {left: -1400}, 0.4);
				t1.to('#biginfobar', 0.3, {left: -1400}, 0.1);
				t1.to('#orangeline2', 0.3, {left: -1400}, 0);
				t1.to('#hostnamebar', 0.4, {right: -2920}, 0);
				t1.to('#orangehostline1', 0.4, {right: -2920}, 0.2);
				t1.to('#hostinfobar', 0.3, {right: -2920}, 0.7);
				t1.to('#orangehostline2', 0.3, {right: -2920}, 0.9);
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

				TweenLite.to([
					'.littleinfobar',
					'.littlenamebar'
				], 0.5, {
					opacity: 1
				});
			} else {
				TweenLite.to([
					'#player1',
					'#player2',
					'#player3',
					'#player4'
				], 0.5, {
					opacity: 0
				});

				// TODO: This does nothing, because the elements in question are classes, not IDs.
				TweenLite.to([
					'#littleinfobar',
					'#littlenamebar'
				], 0.5, {
					display: 'none'
				});
			}
		}
	});
})();
