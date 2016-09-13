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

	// Used to programmatically access any of the above 8 replicants, via `REPLICANTS[name]`.
	const REPLICANTS = {
		host,
		couch1,
		couch2,
		couch3,
		player1,
		player2,
		player3,
		player4
	};

	Polymer({
		is: 'toth-nameplate-control',

		ready() {
			host.on('change', newVal => {
				this.host = {};
				this.host = newVal;
			});

			couch1.on('change', newVal => {
				this.couch1 = {};
				this.couch1 = newVal;
			});

			couch2.on('change', newVal => {
				this.couch2 = {};
				this.couch2 = newVal;
			});

			couch3.on('change', newVal => {
				this.couch3 = {};
				this.couch3 = newVal;
			});

			player1.on('change', newVal => {
				this.player1 = {};
				this.player1 = newVal;
			});

			player2.on('change', newVal => {
				this.player2 = {};
				this.player2 = newVal;
			});

			player3.on('change', newVal => {
				this.player3 = {};
				this.player3 = newVal;
			});

			player4.on('change', newVal => {
				this.player4 = {};
				this.player4 = newVal;
			});
		},

		hideOverlay() {
			this.visible = false;
		},

		showOverlay() {
			this.visible = true;
			this.playersVisible = false;
		},

		hidePlayers() {
			this.playersVisible = false;
		},

		showPlayers() {
			this.visible = false;
			this.playersVisible = true;
		},

		_handleSelectedItemChanged(e) {
			const target = e.target;
			const slot = target.getAttribute('data-slot');
			const selectedItem = e.detail.value;
			const replicant = REPLICANTS[slot];

			// Clear out the target's selected item once we have it.
			e.target.value = null;

			if (!selectedItem || !replicant) {
				return;
			}

			// Copy the values out individually, to avoid object reference problems down the line.
			replicant.value = {
				name: selectedItem.name,
				info: selectedItem.info
			};
		}
	});
})();
