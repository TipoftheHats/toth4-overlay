'use strict';

class TimeObject {
	constructor(rawSeconds) {
		const hms = TimeObject.secondsToHMS(rawSeconds);
		this.hours = hms.h;
		this.minutes = hms.m;
		this.seconds = hms.s;
		this.formatted = TimeObject.formatHMS(hms);
		this.raw = rawSeconds;
	}
}

TimeObject.increment = function (t) {
	t.raw++;

	const hms = TimeObject.secondsToHMS(t.raw);
	t.hours = hms.h;
	t.minutes = hms.m;
	t.seconds = hms.s;
	t.formatted = TimeObject.formatHMS(hms);
	t.timestamp = Date.now();
	return t;
};

TimeObject.decrement = function (t) {
	t.raw--;

	const hms = TimeObject.secondsToHMS(t.raw);
	t.hours = hms.h;
	t.minutes = hms.m;
	t.seconds = hms.s;
	t.formatted = TimeObject.formatHMS(hms);
	t.timestamp = Date.now();
	return t;
};

TimeObject.formatHMS = function (hms) {
	let str = '';
	if (hms.h) {
		str += `${hms.h}:`;
	}

	str += `${(hms.m < 10 ? `0${hms.m}` : hms.m)}:${(hms.s < 10 ? `0${hms.s}` : hms.s)}`;
	return str;
};

TimeObject.secondsToHMS = function (d) {
	return {
		h: Math.floor(d / 3600),
		m: Math.floor(d % 3600 / 60),
		s: Math.floor(d % 3600 % 60)
	};
};

TimeObject.parseSeconds = function (timeString) {
	const timeParts = timeString.split(':');
	if (timeParts.length === 3) {
		return parseInt(timeParts[0] * 3600, 10) + parseInt(timeParts[1] * 60, 10) + parseInt(timeParts[2], 10);
	}

	if (timeParts.length === 2) {
		return parseInt(timeParts[0] * 60, 10) + parseInt(timeParts[1], 10);
	}

	throw new Error(`Unexpected format of timeString argument: ${timeString}`);
};

module.exports = TimeObject;
