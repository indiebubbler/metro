// internal set of notes that will trigger samples on sampler
export const AccentNotes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3"];


const accentTypes = {}
Object.keys(AccentNotes).map(function (item, idx) {
	   accentTypes[ "accent_" + idx ] = idx;
	   return true;
});
export {accentTypes};

// set of colors for accents
export const accentColor = {	
	0: '#ff6355',
	1: '#ff7155',
	2: '#ff8055',
	3: '#ff8e55',
	4: '#ff9955',
	5: '#ff9c55',
	6: '#ffaa55'
}