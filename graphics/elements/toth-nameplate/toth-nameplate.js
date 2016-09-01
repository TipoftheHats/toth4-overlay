(function() {
		'use strict';

		Polymer({
				is: 'toth-nameplate',

				ready() {
					this.initialized = false;

					nodecg.Replicant('couchVisible').on('change', this.visibleCouch.bind(this));
					nodecg.Replicant('playerVisible').on('change', this.visiblePlayers.bind(this));

				},
				visibleCouch(newVal, oldVal) {
					if (_.isNil(oldVal) && this.initialized) {
						return;
					}
					this.initialized = true;
					if (!oldVal && newVal) {
						let timeline = new TimelineLite();

						if (this.name1) {
						TweenLite.to('#couch1', 0.5, {	display: 'inline-block'	});
						}
						if (this.name2) {
						TweenLite.to('#couch2', 0.5, {display: 'inline-block'	});
						}
						if (this.name3) {
						TweenLite.to('#couch3', 0.5, {display: 'inline-block'	});
						}
						if (this.name4) {
						TweenLite.to('#couch1', 0.5, {display: 'inline-block'	});
						}

						TweenLite.to('#bignamebar', 0.5, {display: 'inline-block'	});
						TweenLite.to('#biginfobar', 0.5, {display: 'inline-block'	});

					} else if (oldVal && !newVal) {
						if (this.name1) {
						TweenLite.to('#couch1', 0.5, {display: 'none'	});
						}
						if (this.name2) {
						TweenLite.to('#couch2', 0.5, {display: 'none'	});
						}
						if (this.name3) {
						TweenLite.to('#couch3', 0.5, {display: 'none'	});
						}
						if (this.name4) {
						TweenLite.to('#couch1', 0.5, {display: 'none'	});
						}
						TweenLite.to('#bignamebar', 0.5, {display: 'none'	});
						TweenLite.to('#biginfobar', 0.5, {display: 'none'	});
					}
				},
				visiblePlayers(newVal, oldVal) {
					if (_.isNil(oldVal) && this.initialized) {
						return;
					}
					this.initialized = true;
					if (!oldVal && newVal) {
						let timeline = new TimelineLite();

						if (this.name1) {
						TweenLite.to('#player1', 0.5, {	display: 'inline-block'	});
						}
						if (this.name2) {
						TweenLite.to('#player2', 0.5, {display: 'inline-block'	});
						}
						if (this.name3) {
						TweenLite.to('#player3', 0.5, {display: 'inline-block'	});
						}
						if (this.name4) {
						TweenLite.to('#player4', 0.5, {display: 'inline-block'	});
						}

						TweenLite.to('.littleinfobar', 0.5, {display: 'inline-block'	});
						TweenLite.to('.littlenamebar', 0.5, {display: 'inline-block'	});

					} else if (oldVal && !newVal) {
						if (this.name1) {
						TweenLite.to('#player1', 0.5, {display: 'none'	});
						}
						if (this.name2) {
						TweenLite.to('#player2', 0.5, {display: 'none'	});
						}
						if (this.name3) {
						TweenLite.to('#player3', 0.5, {display: 'none'	});
						}
						if (this.name4) {
						TweenLite.to('#player4', 0.5, {display: 'none'	});
						}
						TweenLite.to('#littleinfobar', 0.5, {display: 'none'	});
						TweenLite.to('#littlenamebar', 0.5, {display: 'none'	});
					}
				}
			});
		})();
