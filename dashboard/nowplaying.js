'use strict';

var $panel = $bundle.filter('.nowplaying');
var $show = $panel.find('.js-show');
var $marquee = $panel.find('marquee');

var pulsing = nodecg.Replicant('pulsing');
pulsing.on('change', function (oldVal, newVal) {
    																																								$show.prop('disabled', newVal);
});

var nowPlaying = nodecg.Replicant('nowPlaying');
nowPlaying.on('change', function (oldVal, newVal) {
    																																								$marquee.text(newVal.artistSong);
});

$show.click(function () { nodecg.sendMessage('np_pulse'); });
