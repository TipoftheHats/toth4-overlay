(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.donations');
    																																								var $test = $panel.find('button[command="test"]');
    																																								var $amount = $panel.find('input[field="amount"]');
    																																								var $donor = $panel.find('input[field="donor"]');

    																																								$test.click(function () {
        																																								nodecg.sendMessage('donation', {
            																																								amount: $amount.val(),
            																																								donor__visiblename: $donor.val()
        });
    });
})();
