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
    },
    YAMAHA_RX5: {
        key: 'yamaha_rx5',
        label: 'Yamaha RX 5',
        samples: [{
            file: "Kick.wav",
            label: "Kick",
            // color:  colors[0],
            idx: 0
        }, {
            file: "Rim.wav",
            label: "Rim",
            // color:  colors[3],
            idx: 1
        }, {
            file: "Ride.wav",
            label: "Ride",
            // color:  colors[2],
            idx: 2
        }, {
            file: "Cowbell.wav",
            label: "Cowbell",
            // color:  colors[1],
            idx: 3
        }, {
            file: "Shaker.wav",
            label: "Shaker",
            // color:  colors[1],
            idx: 4
        }]
    }
};


const InstrumentsByKey = {}
Object.keys(Instruments).map(function (item, idx) {
    InstrumentsByKey[ Instruments[item].key ] = Instruments[item];
    // expected to return a value from arrow func
    return true;
});
export {InstrumentsByKey};

export const InstrumentsArray = Object.keys(Instruments)
.map(item => {
    return Instruments[item]
});
