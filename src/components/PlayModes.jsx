
// NOTE: If we change any of existing string names we will screw up user presets on client's side
export const PlayModes = {
	BY_BAR: "by_bar",
	BY_TIME: "by_time",
	SET_TIME: "set_time",
	CONSTANT: "constant"
};

export const getPlayModeFromUrl = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const playModeParam = urlParams.get('playMode');
	
	if (playModeParam && Object.values(PlayModes).includes(playModeParam)) {
		return playModeParam;
	}
	
	return PlayModes.CONSTANT; // Default to CONSTANT if no valid playMode is specified
};
