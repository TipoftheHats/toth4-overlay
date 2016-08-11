(function () {
	'use strict';

	const drafters = Array.from(document.getElementsByClassName('draft-picker'));
	const selects = Array.from(document.getElementsByTagName('select'));
	const draftableSelects = Array.from(document.querySelectorAll('[data-set="draftable"]'));
	const bannedSelects = Array.from(document.querySelectorAll('[data-set="banned"]'));
	const availableSelects = Array.from(document.querySelectorAll('[data-set="available"]'));
	const pickedSelects = Array.from(document.querySelectorAll('[data-set="picked"]'));

	const players = nodecg.Replicant('df_players');
	players.on('change', newVal => {
		// Remove all options from all <select> elements
		selects.forEach(element => {
			element.innerHTML = '';
		});

		const draftablePlayers = newVal.filter(player => player.state === 'available' || player.state === 'drafted');
		draftableSelects.forEach(select => {
			select.innerHTML = '<option value="">-- Choose a player --</option>';
			const draftableOpts = playersToOptGroups(draftablePlayers);
			draftableOpts.forEach(opt => select.appendChild(opt));
		});

		// Set the selected players for the draftablekafiog jaiwerf fuck
		setDraftedPlayers();

		const bannedPlayers = newVal.filter(player => player.state === 'banned');
		bannedSelects.forEach(select => {
			const bannedOpts = playersToOptGroups(bannedPlayers);
			bannedOpts.forEach(opt => select.appendChild(opt));
		});

		const availablePlayers = newVal.filter(player => player.state === 'available');
		availableSelects.forEach(select => {
			const availableOpts = playersToOptGroups(availablePlayers);
			availableOpts.forEach(opt => select.appendChild(opt));
		});

		const pickedPlayers = newVal.filter(player => player.state === 'picked');
		pickedSelects.forEach(select => {
			const pickedOpts = playersToOptGroups(pickedPlayers);
			pickedOpts.forEach(opt => select.appendChild(opt));
		});
	});

	const teams = nodecg.Replicant('df_teams');
	teams.on('change', newVal => {
		// This is dumb and inefficient, but we have to check each player.
		players.value.forEach(player => {
			if (player.state !== 'drafted') {
				return;
			}

			const allPlayers = newVal.red.concat(newVal.blu);
			const found = allPlayers.some(p => {
				return p && p.name === player.name;
			});

			if (!found) {
				player.state = 'available';
			}
		});

		setDraftedPlayers();
	});

	drafters.forEach(select => {
		select.addEventListener('change', e => {
			const team = e.target.getAttribute('data-team');
			const teamIndex = e.target.getAttribute('data-index');
			const playerName = e.target.value;

			if (playerName === '') {
				teams.value[team][teamIndex] = '';
			} else {
				let playerIndex;
				players.value.some((player, idx) => {
					if (player.name === playerName) {
						playerIndex = idx;
						player.state = 'drafted';
						return true;
					}

					return false;
				});

				if (typeof playerIndex !== 'undefined') {
					teams.value[team][teamIndex] = players.value[playerIndex];
				}
			}
		});
	});

	// Ban button
	document.querySelector('[command="ban"]').addEventListener('click', () => {
		multiSelectHandler(document.querySelector('[data-id="ban_available"]'), 'banned');
	});

	// Unban button
	document.querySelector('[command="unban"]').addEventListener('click', () => {
		multiSelectHandler(document.querySelector('[data-id="ban_banned"]'), 'available');
	});

	// Pick button
	document.querySelector('[command="pick"]').addEventListener('click', () => {
		multiSelectHandler(document.querySelector('[data-id="pick_available"]'), 'picked');
	});

	// Unpick button
	document.querySelector('[command="unpick"]').addEventListener('click', () => {
		multiSelectHandler(document.querySelector('[data-id="pick_picked"]'), 'available');
	});

	// Lock-in Draft button
	document.querySelector('[command="lock"]').addEventListener('click', () => {
		// Un-ban all banned players and set all "drafted" players to "picked"
		players.value.forEach(player => {
			if (player.state === 'banned') {
				player.state = 'available';
			} else if (player.state === 'drafted') {
				player.state = 'picked';
			}
		});

		// Clear out the teams
		teams.value.red = [];
		teams.value.blu = [];
	});

	function multiSelectHandler(el, state) {
		if (!el.selectedOptions || el.selectedOptions.length <= 0) {
			return;
		}

		const namesToProcess = Array.from(el.selectedOptions).map(opt => opt.value);
		namesToProcess.forEach(name => {
			players.value.some(player => {
				if (player.name === name) {
					player.state = state;
					return true;
				}

				return false;
			});
		});
	}

	function playersToOptGroups(players) {
		const optGroups = [];

		const optGroupsByClass = {};
		players.forEach(player => {
			if (!optGroupsByClass[player.playerClass]) {
				optGroupsByClass[player.playerClass] = document.createElement('optgroup');
				optGroupsByClass[player.playerClass].label = player.playerClass;
			}

			const option = document.createElement('option');
			option.value = player.name;
			option.innerText = player.name;
			optGroupsByClass[player.playerClass].appendChild(option);
		});

		for (const className in optGroupsByClass) {
			if ({}.hasOwnProperty.call(optGroupsByClass, className)) {
				optGroups.push(optGroupsByClass[className]);
			}
		}

		return optGroups;
	}

	function setDraftedPlayers() {
		if (!teams.value) {
			return;
		}

		teams.value.red.forEach((player, idx) => {
			if (!player) {
				return;
			}

			document.querySelector(`[data-team="red"][data-index="${idx}"]`).value = player.name;
		});

		teams.value.blu.forEach((player, idx) => {
			if (!player) {
				return;
			}

			document.querySelector(`[data-team="blu"][data-index="${idx}"]`).value = player.name;
		});
	}
})();
