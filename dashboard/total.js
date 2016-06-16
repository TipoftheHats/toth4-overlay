(function () {
    																																								'use strict';

    																																								var panel = $bundle.filter('.total');
    																																								var totalDisplay = panel.find('.totalDisplay');
    																																								var updateGroup = panel.find('.js-update');
    																																								var updateBtn = updateGroup.find('button');

    																																								var modal = $('#toth3-overlay_editTotal');
    																																								var saveTotal = modal.find('.js-save');
    																																								var totalEdit = modal.find('input[name="total"]');

    																																								var autoUpdateOnBtn = panel.find('.js-automaticOn');
    																																								var autoUpdateOffBtn = panel.find('.js-automaticOff');

    																																								var total = nodecg.Replicant('total')
        .on('change', function (oldVal, newVal) {
            																																								totalDisplay.html(newVal.formatted);
            																																								totalEdit.val(newVal.raw);
        });

    																																								var autoUpdateTotal = nodecg.Replicant('autoUpdateTotal')
        .on('change', function (oldVal, newVal) {
            																																								autoUpdateOnBtn.prop('disabled', newVal);
            																																								autoUpdateOffBtn.prop('disabled', !newVal);
        });

    																																								autoUpdateOnBtn.click(function () { autoUpdateTotal.value = true; });
    																																								autoUpdateOffBtn.click(function () { autoUpdateTotal.value = false; });

    																																								updateBtn.click(function () {
        																																								var self = this;
        																																								$(self).prop('disabled', true);
        																																								nodecg.sendMessage('updateTotal', function (err, updated) {
            																																								if (err) {
                																																								console.error(err.message);
                																																								showUpdateResult(updateGroup, 'danger', 'ERROR! Check console');
                																																								return;
            }

            																																								if (updated) {
                																																								console.info('[toth3-overlay] Total successfully updated');
                																																								showUpdateResult(updateGroup, 'success', 'Got current total!');
            } else {
                																																								console.info('[toth3-overlay] Total unchanged, not updating');
                																																								showUpdateResult(updateGroup, 'default', 'Total unchanged');
            }

        });
    });

    																																								saveTotal.click(function () {
        																																								var raw = totalEdit.val();
        																																								total.value = {
            																																								raw: parseFloat(raw),
            																																								formatted: window.numeral(raw).format('$0,0')
        };
    });

    																																								function showUpdateResult(el, type, msg) {
        																																								var resultEl = el.find('.updateResult-' + type);

        																																								if (resultEl.hasClass('updateResult-show')) {
            																																								console.warn('[toth3-overlay] Tried to show multiple update results at once for element:', el);
            																																								return;
        }

        																																								var btn = el.find('button');
        																																								resultEl.html(msg).addClass('updateResult-show');
        																																								setTimeout(function () {
            																																								btn.prop('disabled', false);
            																																								resultEl.removeClass('updateResult-show');
        }, 4000);
    }
})();
