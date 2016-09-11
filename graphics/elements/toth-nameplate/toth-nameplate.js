(function () {
	'use strict';
	Polymer({
		is: 'toth-nameplate',

		ready() {
			this.initialized = false;
			nodecg.Replicant('couchVisible').on('change', this.visibleCouch.bind(this));
			nodecg.Replicant('playerVisible').on('change', this.visiblePlayers.bind(this));
			nodecg.Replicant('couch1').on('change', this.hideNames.bind(this));
			nodecg.Replicant('couch2').on('change', this.hideNames.bind(this));
			nodecg.Replicant('couch3').on('change', this.hideNames.bind(this));
			nodecg.Replicant('couch4').on('change', this.hideNames.bind(this));
		},
		visibleCouch(newVal, oldVal) {
			if (_.isNil(oldVal) && this.initialized) {
				return;
			}
			this.initialized = true;
			if (!oldVal && newVal) {
				console.log(this.name1);
				console.log(this.name2);
				console.log(this.name3);
				// couch potatoes
				if (this.name2) {
					TweenLite.to('#couch1', 0.5, {
						width: '400px',
						opacity: 1
					});
				}
				if (this.name3) {
					TweenLite.to('#couch2', 0.5, {
						width: '400px',
						opacity: 1

					});
				}
				if (this.name4) {
					TweenLite.to('#couch3', 0.5, {
						width: '400px',
						opacity: 1
					});
				}
					// host
				if (this.name1) {
					TweenLite.to('#host', 0.5, {
						width: '400px',
						opacity: 1
					});
				}
				const t1 = new TimelineLite();
				if (this.name2 && this.name3 && this.name4) {
					t1.to('#bignamebar', 0.4, {left: 0}, 0);
					t1.to('#orangeline1', 0.4, {left: -1}, 0.2);
					t1.to('#biginfobar', 0.3, {left: 0}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -7}, 0.9);
				} else if ((this.name2 && this.name3 && !this.name4) || (this.name2 && !this.name3 && this.name4) || (!this.name2 && this.name3 && this.name4)) {
					t1.to('#bignamebar', 0.4, {left: -400}, 0);
					t1.to('#orangeline1', 0.4, {left: -401}, 0.2);
					t1.to('#biginfobar', 0.3, {left: -400}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -407}, 0.9);
				} else if ((this.name2 && !this.name3 && !this.name4) || (!this.name2 && this.name3 && !this.name4) || (!this.name2 && !this.name3 && this.name4)) {
					t1.to('#bignamebar', 0.4, {left: -800}, 0);
					t1.to('#orangeline1', 0.4, {left: -801}, 0.2);
					t1.to('#biginfobar', 0.3, {left: -800}, 0.7);
					t1.to('#orangeline2', 0.3, {left: -807}, 0.9);
				}
				if (this.name1) {
					t1.to('#hostnamebar', 0.4, {right: -1920}, 0);
					t1.to('#orangehostline1', 0.4, {right: -1920}, 0.2);
					t1.to('#hostinfobar', 0.3, {right: -1920}, 0.7);
					t1.to('#orangehostline2', 0.3, {right: -1920}, 0.9);
				}
			} else if (oldVal && !newVal) {
				if (this.name2) {
					TweenLite.to('#couch1', 0.1, {
						opacity: 0,
						width: '0'

					});
				}
				if (this.name3) {
					TweenLite.to('#couch2', 0.1, {
						opacity: 0,
						width: '0'

					});
				}
				if (this.name4) {
					TweenLite.to('#couch3', 0.1, {
						opacity: 0,
						width: '0'
					});
				}
				if (this.name1) {
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
		visiblePlayers(newVal, oldVal) {
			if (_.isNil(oldVal) && this.initialized) {
				return;
			}
			this.initialized = true;
			if (!oldVal && newVal) {
				if (this.player1) {
					TweenLite.to('#player1', 0.5, {
						display: 'inline-block'
					});
				}
				if (this.player2) {
					TweenLite.to('#player2', 0.5, {
						display: 'inline-block'
					});
				}
				if (this.player3) {
					TweenLite.to('#player3', 0.5, {
						display: 'inline-block'
					});
				}
				if (this.player4) {
					TweenLite.to('#player4', 0.5, {
						display: 'inline-block'
					});
				}

				TweenLite.to('.littleinfobar', 0.5, {
					display: 'inline-block'
				});
				TweenLite.to('.littlenamebar', 0.5, {
					display: 'inline-block'
				});
			} else if (oldVal && !newVal) {
				TweenLite.to('#player1', 0.5, {
					display: 'none'
				});

				TweenLite.to('#player2', 0.5, {
					display: 'none'
				});
				TweenLite.to('#player3', 0.5, {
					display: 'none'
				});
				TweenLite.to('#player4', 0.5, {
					display: 'none'
				});
				TweenLite.to('#littleinfobar', 0.5, {
					display: 'none'
				});
				TweenLite.to('#littlenamebar', 0.5, {
					display: 'none'
				});
			}
		}
	});
})();
