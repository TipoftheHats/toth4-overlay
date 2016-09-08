(function () {
	'use strict';

	const countRep = nodecg.Replicant('countdown');
	const timeNode = document.getElementById('time');
	countRep.on('change', newVal => {
		timeNode.textContent = newVal.time.formatted;
		timeNode.style.opacity = newVal.running ? 1 : 0;
	});
})();
