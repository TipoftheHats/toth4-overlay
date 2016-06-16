(function () {
	'use strict';

	const players = nodecg.Replicant('df_players');
	players.on('change', newVal => {
		newVal.forEach(player => {
			const cardEl = document.querySelector(`toth-dotafortress-card[player-class="${player.playerClass}"][index="${player.index}"]`);
			cardEl.name = player.name;
			if (player.state === 'available') {
				cardEl.removeAttribute('disabled');
			} else {
				cardEl.setAttribute('disabled', 'true');
			}
		});
	});

	const teams = nodecg.Replicant('df_teams');
	teams.on('change', newVal => {
		for (let i = 0; i < 6; i++) {
			const redCardEl = document.querySelector(`#red toth-dotafortress-card:nth-child(${i + 1})`);
			const bluCardEl = document.querySelector(`#blu toth-dotafortress-card:nth-child(${i + 1})`);

			if (newVal.red[i] && newVal.red[i].name) {
				redCardEl.name = newVal.red[i].name;
				redCardEl.playerClass = newVal.red[i].playerClass;
				redCardEl.index = newVal.red[i].index;
			} else {
				redCardEl.name = '';
				redCardEl.playerClass = '';
				redCardEl.index = -1;
			}

			if (newVal.blu[i] && newVal.blu[i].name) {
				bluCardEl.name = newVal.blu[i].name;
				bluCardEl.playerClass = newVal.blu[i].playerClass;
				bluCardEl.index = newVal.blu[i].index;
			} else {
				bluCardEl.name = '';
				bluCardEl.playerClass = '';
				bluCardEl.index = -1;
			}
		}
	});
})();
