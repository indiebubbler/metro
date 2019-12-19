export const AccentNotes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3"];


// export const accentTypes = {
// 	UP: 0,
// 	MIDDLE: 1,
// 	DOWN: 2
// };



const accentTypes = {}
Object.keys(AccentNotes).map(function (item, idx) {
   	accentTypes[ "accent_" + idx ] = idx;
});
export {accentTypes};


// const accentTypesArr = [];

// export const accentTypesArr = [
// 	accentTypes.UP, accentTypes.MIDDLE, accentTypes.DOWN
// ];
// export accentTypesArr;

export const accentColor = {
	0: '#f95',
	1: '#ff6355',
	2: '#ff7155',
	3: '#ff8055',
	4: '#ff8e55',
	5: '#ff9c55',
	6: '#ffaa55'
}