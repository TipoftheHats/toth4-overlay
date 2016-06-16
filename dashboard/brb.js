(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.brb');
    																																								var $take = $panel.find('button[command="take"]');
    																																								var $show = $panel.find('button[command="show"]');
    																																								var $hide = $panel.find('button[command="hide"]');
    																																								var $preview = $panel.find('.js-preview');
    																																								var $program = $panel.find('.js-program');

    																																								var upNext = nodecg.Replicant('upNext')
        .on('change', function (oldVal, newVal) {
            																																								$program.find('.js-upNext').val(newVal);
        });

    																																								var brbShowing = nodecg.Replicant('brbShowing')
        .on('change', function (oldVal, newVal) {
            																																								$show.prop('disabled', newVal);
            																																								$hide.prop('disabled', !newVal);
        });

    																																								$show.click(function () {
        																																								brbShowing.value = true;
    });

    																																								$hide.click(function () {
        																																								brbShowing.value = false;
    });

    																																								$take.click(function () {
        																																								upNext.value = $preview.find('.js-upNext').val();
    });
})();
