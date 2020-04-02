// internal set of notes that will trigger samples on sampler
export const AccentNotes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3"];


const accentTypes = {}
Object.keys(AccentNotes).map(function (item, idx) {
	   accentTypes[ "accent_" + idx ] = idx;
	   return true;
});
export {accentTypes};

