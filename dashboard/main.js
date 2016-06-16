(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.main');
    																																								var $show = $panel.find('button[command="show"]');
    																																								var $hide = $panel.find('button[command="hide"]');

    																																								var mainShowing = nodecg.Replicant('mainShowing', {defaultValue: true})
        .on('change', function (oldVal, newVal) {
            																																								$show.prop('disabled', newVal);
            																																								$hide.prop('disabled', !newVal);
        });

    																																								$show.click(function () {
        																																								mainShowing.value = true;
    });

    																																								$hide.click(function () {
        																																								mainShowing.value = false;
    });
})();
