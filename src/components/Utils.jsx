const Utils = {
    padTime: function(t) {
		return t < 10 ? "0" + t : t;
	},
	formatTime: function(timeInSeconds) {
		//{this.leadingZeroCheck(now.getMinutes())}:{now.getSeconds()} --
		let t = new Date(0, 0, 0, 0, 0, 0, 0);
		t.setSeconds(timeInSeconds);
		let m = t.getMinutes();
		let o = "";
		if (m !== 0) {
			o += t.getMinutes(); //this.padTime(t.getMinutes());
            o += ":";
            o += "" + Utils.padTime(t.getSeconds());
        }
        else {
            o += t.getSeconds();
        }
		return o;
    }
}

export default Utils;