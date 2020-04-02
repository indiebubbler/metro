export const Instruments = {
    TABLA: {
        key: 'tabla',
        label: 'Tabla'
    },
    ELECTRO_KIT: {
        key: 'electrokit',
        label: 'Electronic Kit'
        
    },
    METRONOME: {
        key: 'metronome',
        label: 'Metronome'
        
    },
    BASIC_DRUM_KIT: {
        key: 'basicdrumkit',
        label: 'Basic Drum Kit'
        
    },
    YAMAHA_RX5: {
        key: 'yamaha_rx5',
        label: 'Yamaha RX 5'
    }
};


export const Samples = [
{
        file: "dha-slide.wav",
        label: "Dha",
        instrumentKey: 'tabla'
    }, {
        file: "dhin-slide.wav",
        label: "Dhin",
        instrumentKey: 'tabla'
    }, {
        file: "tin.wav",
        label: "Tin",
        instrumentKey: 'tabla'
    },{
        file: "Kick.wav",
        label: "Kick",
        instrumentKey: 'electrokit'
    }, {
        file: "Snare.wav",
        label: "Snare",
        instrumentKey: 'electrokit'
    }, {
        file: "HiHat.wav",
        label: "Hi Hat",
        instrumentKey: 'electrokit'
    }, {
        file: "tap.wav",
        label: "Tap",
        instrumentKey: 'metronome'
    }, {
        file: "down.wav",
        label: "Down",
        instrumentKey: 'metronome'
    }, {
        file: "up.wav",
        label: "Up",
        instrumentKey: 'metronome'
    },
    {
        file: "Kick.wav",
        label: "Kick",
        instrumentKey: 'basicdrumkit'
    }, {
        file: "Snare.wav",
        label: "Snare",
        instrumentKey: 'basicdrumkit'
    }, {
        file: "ClosedHat.wav",
        label: "Closed Hat",
        instrumentKey: 'basicdrumkit'
    }, {
        file: "OpenHat.wav",
        label: "Open Hat",
        instrumentKey: 'basicdrumkit'
    },
    {
        file: "Kick.wav",
        label: "Kick",
        instrumentKey: 'yamaha_rx5'
    }, {
        file: "Rim.wav",
        label: "Rim",
        instrumentKey: 'yamaha_rx5'
    }, {
        file: "Ride.wav",
        label: "Ride",
        instrumentKey: 'yamaha_rx5'
    }, {
        file: "Cowbell.wav",
        label: "Cowbell",
        instrumentKey: 'yamaha_rx5'
    }, {
        file: "Shaker.wav",
        label: "Shaker",
        instrumentKey: 'yamaha_rx5'
    }
];



const InstrumentsByKey = {}
Object.keys(Instruments).map(function (item, idx) {
    InstrumentsByKey[Instruments[item].key] = Instruments[item];
    // expected to return a value from arrow func
    return true;
});
export { InstrumentsByKey };

export const InstrumentsArray = Object.keys(Instruments)
    .map(item => {
        return Instruments[item]
    });
