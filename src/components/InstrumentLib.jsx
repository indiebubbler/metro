import { Component } from "react";
import SoundMachineInstrument from "./SoundMachineInstrument"
import Tone from 'tone'
export const instruments = {
	TABLA: "tabla",
    ELECTRO_KIT: "electrokit",
    METRONOME: "metronome"	// ACOUSTIC_KIT: "acoustic_kit"
};

class InstrumentLib extends Component {
	state = {};
    lib = {};
    currentInstrument = undefined
    fft = undefined


    constructor(defaultInstrument) {
        super();
    
        //Tone.Buffer.on("load", () => this.onBufferLoaded());
		var tabla = new SoundMachineInstrument({
            key: instruments.TABLA,
            label: "Tabla",
			samples: ["dha-slide.wav", "dhin-slide.wav", "tin.wav"]
        });
        this.lib[ tabla.key ] = tabla;
    
        var electro = new SoundMachineInstrument({
            key: instruments.ELECTRO_KIT,
            label: 'Electronic Kit',
			samples: ["Kick.wav", "HiHat.wav", "Snare.wav"]
        });
        this.lib[ electro.key ] = electro;

        var metronome = new SoundMachineInstrument({
            key: instruments.METRONOME,
            label: "Metronome",
            samples: ["tap.wav", "down.wav","up.wav"]
        })

        this.lib[ metronome.key ] = metronome;
        

        this.setInstrument(defaultInstrument)
        
        // console.log('<InstrumentLib>done constructor')

        this.fft = new Tone.FFT(128);
        
        // connect instruments to FFT analyzer
        electro.fan(this.fft).toMaster();
        tabla.fan(this.fft).toMaster();
        metronome.fan(this.fft).toMaster();
    }

    setInstrument(key) {
        if (this.lib[key] === undefined) {
            throw new Error("InstrumentLib has no such instrument with given key: " + key)
        }
        this.currentInstrument = key;
    }
 
    getInstrument() {
        if (this.lib[this.currentInstrument] === undefined) {
            throw new Error("There is no such instrument in InstrumentLib: " + this.currentInstrument)
        }
        return this.lib[this.currentInstrument];
    }

	// render() {
	// 	return <div />;
	// }
}
export default InstrumentLib;
