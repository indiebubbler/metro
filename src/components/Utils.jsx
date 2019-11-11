const Utils = {
	padTime: function (t) {
		return t < 10 ? "0" + t : t;
	},

	formatTime: function(timeInSeconds) {
		return Utils.formatTimeFull(timeInSeconds, 'h','m','s');
	},

	formatTimeLong: function(timeInSeconds) {
		return Utils.formatTimeFull(timeInSeconds, ' hours', ' minutes', ' seconds');
	},

	formatTimeFull: function (timeInSeconds, hLabel,mLabel,sLabel) {
		//{this.leadingZeroCheck(now.getMinutes())}:{now.getSeconds()} --
		let t = new Date(0, 0, 0, 0, 0, 0, 0);
		t.setSeconds(timeInSeconds);
		const h = t.getHours();
		const m = t.getMinutes();
		const s = t.getSeconds();

		let o = "";

		if (h !== 0) {
			o += h + hLabel + " ";
		}


		if (m !== 0 || h !== 0) {
			if (h !== 0) {
				o += this.padTime(m) + mLabel + " ";
			}
			else {
				o += m + mLabel + " ";
			}

			if (s !== 0) {
				o += "" + Utils.padTime(s) + sLabel
			}
		}
		else {
			o += t.getSeconds() + sLabel
		}
		return o;
	}
}

export default Utils;