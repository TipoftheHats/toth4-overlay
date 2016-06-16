(function () {
	'use strict';

	const $panel = $bundle.filter('.twitter');
	const $take = $panel.find('button[command="take"]');
	const $show = $panel.find('button[command="show"]');
	const $hide = $panel.find('button[command="hide"]');
	const $pulse = $panel.find('button[command="pulse"]');
	const $preview = $panel.find('.js-preview');
	const $program = $panel.find('.js-program');

	nodecg.Replicant('tweet').on('change', newVal => {
		$program.find('.js-id').val(newVal.id);
		$program.find('.js-content').val(newVal.text);
	});

	const tweetShowing = nodecg.Replicant('tweetShowing')
		.on('change', newVal => {
			$show.prop('disabled', newVal);
			$pulse.prop('disabled', newVal);
			$hide.prop('disabled', !newVal);

			// When this changes, disable the "take" button for a bit
			if ($take.data('cooldownTimer')) {
				clearTimeout($take.data('cooldownTimer'));
			}

			$take.prop('disabled', true);
			$take.data('cooldownTimer', setTimeout(() => {
				$take.prop('disabled', false);
			}, 1000));
		});

	nodecg.Replicant('tweetPulsing')
		.on('change', function (oldVal, newVal) {
			$hide.prop('disabled', !tweetShowing.value ? true : newVal);
		});

	$take.click(function () {
		nodecg.sendMessage('getTweet', $preview.find('.js-url').val());
	});

	$show.click(function () {
		tweetShowing.value = true;
	});

	$hide.click(function () {
		tweetShowing.value = false;
	});

	$pulse.click(function () {
		nodecg.sendMessage('pulseTweet', $(this).data('duration'));
	});
})();
