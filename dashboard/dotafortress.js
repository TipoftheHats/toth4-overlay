(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.dotafortress');
    																																								var $drafters = $panel.find('.draft-picker');

    																																								var players = nodecg.Replicant('df_players');
    																																								players.on('change', function (oldVal, newVal) {
        																																								$panel.find('select').html('');

        																																								var draftable = newVal.filter(function (player) {
            																																								return player.state === 'available' || player.state === 'drafted';
        });
        																																								$panel.find('[data-set="draftable"]')
            .html('<option value="">-- Choose a player --</option>')
            .append(playersToOptGroups(draftable));

        // Set the selected players for the draftablekafiog jaiwerf fuck
        																																								setDraftedPlayers();

        																																								var banned = newVal.filter(function (player) {
            																																								return player.state === 'banned';
        });
        																																								$panel.find('[data-set="banned"]').html(playersToOptGroups(banned));

        																																								var available = newVal.filter(function (player) {
            																																								return player.state === 'available';
        });
        																																								$panel.find('[data-set="available"]').html(playersToOptGroups(available));

        																																								var picked = newVal.filter(function (player) {
            																																								return player.state === 'picked';
        });
        																																								$panel.find('[data-set="picked"]').html(playersToOptGroups(picked));
    });

    																																								var teams = nodecg.Replicant('df_teams');
    																																								teams.on('change', function (oldVal, newVal) {
        // This is dumb and inefficient, but we have to check each player.
        																																								players.value.forEach(function (player) {
            																																								if (player.state !== 'drafted') return;

            																																								var found = false;
            																																								var allPlayers = newVal.red.concat(newVal.blu);
            																																								allPlayers.some(function (p) {
                																																								if (!p) return;
                																																								if (p.name === player.name) {
                    																																								found = true;
                    																																								return true;
                }
            });

            																																								if (!found) {
                																																								player.state = 'available';
            }
        });

        																																								setDraftedPlayers();
    });

    																																								$drafters.on('change', function (e) {
        																																								var team = e.target.getAttribute('data-team');
        																																								var teamIndex = e.target.getAttribute('data-index');
        																																								var playerName = e.target.value;

        																																								if (playerName === '') {
            																																								teams.value[team][teamIndex] = '';
        } else {
            																																								var playerIndex;
            																																								players.value.some(function (player, idx) {
                																																								if (player.name === playerName) {
                    																																								playerIndex = idx;
                    																																								player.state = 'drafted';
                    																																								return true;
                }
            });

            																																								if (typeof playerIndex !== 'undefined') {
                																																								teams.value[team][teamIndex] = players.value[playerIndex];
            }
        }
    });

    // Ban button
    																																								$panel.find('.btn[command="ban"]').click(function () {
        																																								multiSelectHandler($panel.find('[data-id="ban_available"]'), 'banned');
    });

    // Unban button
    																																								$panel.find('.btn[command="unban"]').click(function () {
        																																								multiSelectHandler($panel.find('[data-id="ban_banned"]'), 'available');
    });

    // Pick button
    																																								$panel.find('.btn[command="pick"]').click(function () {
        																																								multiSelectHandler($panel.find('[data-id="pick_available"]'), 'picked');
    });

    // Unpick button
    																																								$panel.find('.btn[command="unpick"]').click(function () {
        																																								multiSelectHandler($panel.find('[data-id="pick_picked"]'), 'available');
    });

    // Lock-in Draft button
    																																								$panel.find('.btn[command="lock"]').click(function () {
        // Un-ban all banned players and set all "drafted" players to "picked"
        																																								players.value.forEach(function (player) {
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

    																																								function multiSelectHandler($el, state) {
        																																								var namesToProcess = $el.val();
        																																								if (!namesToProcess) return;
        																																								namesToProcess.forEach(function (name) {
            																																								players.value.some(function (player) {
                																																								if (player.name === name) {
                    																																								player.state = state;
                    																																								return true;
                }
            });
        });
    }

    																																								function playersToOptGroups(players) {
        																																								var optGroups = [];

        																																								var optGroupsByClass = {};
        																																								players.forEach(function (player) {
            																																								if (!optGroupsByClass[player.playerClass]) {
                																																								optGroupsByClass[player.playerClass] = document.createElement('optgroup');
                																																								optGroupsByClass[player.playerClass].label = player.playerClass;
            }

            																																								var option = document.createElement('option');
            																																								option.value = player.name;
            																																								option.innerText = player.name;
            																																								optGroupsByClass[player.playerClass].appendChild(option);
        });

        																																								for (var className in optGroupsByClass) {
            																																								if (optGroupsByClass.hasOwnProperty(className)) {
                																																								optGroups.push(optGroupsByClass[className]);
            }

        }

        																																								return optGroups;
    }

    																																								function setDraftedPlayers() {
        																																								if (!teams.value) return;

        																																								teams.value.red.forEach(function (player, idx) {
            																																								if (!player) return;
            																																								$drafters.filter('[data-team="red"][data-index="' + idx + '"]').val(player.name);
        });

        																																								teams.value.blu.forEach(function (player, idx) {
            																																								if (!player) return;
            																																								$drafters.filter('[data-team="blu"][data-index="' + idx + '"]').val(player.name);
        });
    }
})();
