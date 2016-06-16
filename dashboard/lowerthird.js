(function () {
    																																								'use strict';

    																																								var $panel = $bundle.filter('.lowerthird');
    																																								var $take = $panel.find('button[command="take"]');
    																																								var $show = $panel.find('button[command="show"]');
    																																								var $hide = $panel.find('button[command="hide"]');
    																																								var $pulse = $panel.find('button[command="pulse"]');
    																																								var $preview = $panel.find('.js-preview');
    																																								var $program = $panel.find('.js-program');

    																																								var texts = nodecg.Replicant('texts')
        .on('change', function (oldVal, newVal) {
            																																								$program.find('.js-title').val(newVal.title);
            																																								$program.find('.js-body').val(newVal.body);

            																																								var evt = document.createEvent('Event');
            																																								var el = $program.find('.js-body')[0];
            																																								evt.initEvent('autosize:update', true, false);
            																																								el.dispatchEvent(evt);
            																																								simulateClick(el);
        });

    																																								var lowerthirdShowing = nodecg.Replicant('lowerthirdShowing')
        .on('change', function (oldVal, newVal) {
            																																								$show.prop('disabled', newVal);
            																																								$pulse.prop('disabled', newVal);
            																																								$hide.prop('disabled', !newVal);

            // When this changes, disable the "take" button for a bit
            																																								if ($take.data('cooldownTimer')) {
                																																								clearTimeout($take.data('cooldownTimer'));
            }

            																																								$take.prop('disabled', true);
            																																								$take.data('cooldownTimer', setTimeout(function () {
                																																								$take.prop('disabled', false);
            }, 1000));
        });

    																																								nodecg.Replicant('lowerthirdPulsing')
        .on('change', function (oldVal, newVal) {
            																																								$hide.prop('disabled', !lowerthirdShowing.value ? true : newVal);
        });

    																																								$take.click(function () {
        																																								texts.value = {
            																																								title: $preview.find('.js-title').val(),
            																																								body: $preview.find('.js-body').val()
        };
    });

    																																								$show.click(function () {
        																																								lowerthirdShowing.value = true;
    });

    																																								$hide.click(function () {
        																																								lowerthirdShowing.value = false;
    });

    																																								$pulse.click(function () {
        																																								nodecg.sendMessage('pulseLowerthird', $(this).data('duration'));
    });

    /*
     * Make the "Body" textareas automatically size themselves
     */
    																																								autosize($panel[0].querySelectorAll('textarea'));
    																																								$preview.find('.js-body').on('autosize:resized', function () {
        																																								simulateClick(this);
    });

// Simulates a "click" event, which triggers Masonry to re-position the panels if necessary.
    																																								function simulateClick(el) {
        																																								var event = new MouseEvent('click', {
            																																								'view': window,
            																																								'bubbles': true,
            																																								'cancelable': true
        });
        																																								el.dispatchEvent(event);
    }
})();
