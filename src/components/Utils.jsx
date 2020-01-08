import { TrRange, GetNavigatorLanguage } from './Locale'

const Utils = {

	toLocaleDateTime: function (dateTime) {
		// safety
		if (!dateTime) return '';

		// go for it
		return new Date(dateTime).toLocaleString(GetNavigatorLanguage(), {
			dateStyle: "long",
			timeStyle: "short"
		});

	},

	padTime: function (t) {
		return t < 10 ? "0" + t : t;
	},

	formatTime: function (timeInSeconds) {
		if (timeInSeconds) {
			return Utils.formatTimeFull(timeInSeconds, 'h', 'm', 's', true);
		}
	},

	formatTimeLong: function (timeInSeconds) {
		if (timeInSeconds) {
			return Utils.formatTimeFull(timeInSeconds, 'hours', 'minutes', 'seconds', false);
		}
	},

	formatTimeFull: function (timeInSeconds, hLabel, mLabel, sLabel, usePad) {
		let t = new Date(0, 0, 0, 0, 0, 0, 0);
		t.setSeconds(timeInSeconds);
		const h = t.getHours();
		const m = t.getMinutes();
		const s = t.getSeconds();

		let o = "";

		if (h !== 0) {
			o += h + ' ' + TrRange(h, hLabel) + " ";
		}

		if (m !== 0 || h !== 0) {
			if (h !== 0 && m !== 0) {
				o += (usePad ? Utils.padTime(m) : m) + ' ' + TrRange(m, mLabel) + " ";
			}
			else if (m !== 0) {
				o += (usePad ? Utils.padTime(m) : m) + ' ' + TrRange(m, mLabel) + " ";
			}
			if (s !== 0) {
				o += "" + (usePad ? Utils.padTime(s) : s) + ' ' + TrRange(s, sLabel)
			}
		}
		else {
			o += t.getSeconds() + ' ' + TrRange(s, sLabel)
		}
		return o.trim();
	},

	storageAvailable: function (type) {
		var storage;
		try {
			storage = window[type];
			var x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch (e) {
			return e instanceof DOMException && (
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// acknowledge QuotaExceededError only if there's something already stored
				(storage && storage.length !== 0);
		}
	}
}

export default Utils;