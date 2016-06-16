(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.scoreboard');
    																																								var $take = $panel.find('button[command="take"]');
    																																								var $show = $panel.find('button[command="show"]');
    																																								var $hide = $panel.find('button[command="hide"]');
    																																								var $preview = $panel.find('.js-preview');
    																																								var $program = $panel.find('.js-program');

    																																								var scores = nodecg.Replicant('scores', {defaultValue: {
        																																								red: {score: 0, tag: 'RED'},
        																																								blu: {score: 0, tag: 'BLU'}
    }})
        .on('change', function (oldVal, newVal) {
            																																								if (!newVal) return;
            																																								$program.find('input[team="red"][field="score"]').val(newVal.red.score);
            																																								$program.find('input[team="blu"][field="score"]').val(newVal.blu.score);
            																																								$program.find('input[team="red"][field="tag"]').val(newVal.red.tag);
            																																								$program.find('input[team="blu"][field="tag"]').val(newVal.blu.tag);
        });

    																																								var scoreboardShowing = nodecg.Replicant('scoreboardShowing')
        .on('change', function (oldVal, newVal) {
            																																								$show.prop('disabled', newVal);
            																																								$hide.prop('disabled', !newVal);
        });

    																																								$show.click(function () {
        																																								scoreboardShowing.value = true;
    });

    																																								$hide.click(function () {
        																																								scoreboardShowing.value = false;
    });

    																																								$take.click(function () {
        																																								scores.value = {
            																																								red: {
                																																								score: $preview.find('input[team="red"][field="score"]').val(),
                																																								tag: $preview.find('input[team="red"][field="tag"]').val()
            },
            																																								blu: {
                																																								score: $preview.find('input[team="blu"][field="score"]').val(),
                																																								tag: $preview.find('input[team="blu"][field="tag"]').val()
            }
        };
    });

    																																								$panel.find('button[command="swap"]').click(function () {
        																																								var blu = {
            																																								score: scores.value.red.score,
            																																								tag: scores.value.red.tag
        };

        																																								var red = {
            																																								score: scores.value.blu.score,
            																																								tag: scores.value.blu.tag
        };

        																																								scores.value = {
            																																								red: red,
            																																								blu: blu
        };
    });
})();
