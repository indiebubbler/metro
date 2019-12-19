// let colors = [
//     '#f95',
//     '#f55',
//     '#f75',
//     '#fa5'
// ]


export const Instruments = {
    TABLA: {
        key: 'tabla',
        label: 'Tabla',
        samples: [{
            file: "dha-slide.wav",
            label: "Dha",
            idx: 0
        }, {
            file: "dhin-slide.wav",
            label: "Dhin",
            idx: 1
        }, {
            file: "tin.wav",
            label: "Tin",
            idx: 2
        }]
    },
    ELECTRO_KIT: {
        key: 'electrokit',
        label: 'Electronic Kit',
        samples: [{
            file: "Kick.wav",
            label: "Kick",
            idx: 0
        }, {
            file: "HiHat.wav",
            label: "Hi Hat",
            idx: 1
        }, {
            file: "Snare.wav",
            label: "Snare",
            idx: 2
        }]
    },
    METRONOME: {
        key: 'metronome',
        label: 'Metronome',
        samples: [{
            file: "tap.wav",
            label: "Tap",
            idx: 0
        }, {
            file: "down.wav",
            label: "Down",
            idx: 1
        }, {
            file: "up.wav",
            label: "Up",
            idx: 2
        }]
    },
    BASIC_DRUM_KIT: {
        key: 'basicdrumkit',
        label: 'Basic Drum Kit',
        samples: [{
            file: "Kick.wav",
            label: "Kick",
            // color:  colors[0],
            idx: 0
        }, {
            file: "Snare.wav",
            label: "Snare",
            // color:  colors[3],
            idx: 1
        }, {
            file: "ClosedHat.wav",
            label: "Closed Hat",
            // color:  colors[2],
            idx: 2
        }, {
            file: "OpenHat.wav",
            label: "Open Hat",
            // color:  colors[1],
            idx: 3
        }]
    }
};


const InstrumentsByKey = {}
Object.keys(Instruments).map(function (item, idx) {
    InstrumentsByKey[ Instruments[item].key ] = Instruments[item];
});
export {InstrumentsByKey};
// export InstrumentsByKey;

// export const InstrumentsByKey = {
//     electrokit: Instruments.ELECTRO_KIT,
//     metronome: Instruments.METRONOME,
//     tabla: Instruments.TABLA,
//     technokit: Instruments.BASIC_DRUM_KIT,
// }
export const InstrumentsArray = [
    Instruments.TABLA, Instruments.ELECTRO_KIT, Instruments.METRONOME, Instruments.BASIC_DRUM_KIT
]
