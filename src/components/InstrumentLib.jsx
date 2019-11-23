import { Component } from "react";
import SoundMachineInstrument from "./SoundMachineInstrument"
import Tone from 'tone'
import { InitPreset } from "./PresetsLib";
import {InstrumentsArray} from "./Instruments"

class InstrumentLib extends Component {
    state = {};
    lib = {};
    currentInstrument = undefined
    fft = undefined


    constructor() {
        super();
        this.fft = new Tone.FFT(128);

        //Tone.Buffer.on("load", () => this.onBufferLoaded());
        InstrumentsArray.map((instrument) => {
            var smi = new SoundMachineInstrument({
                key: instrument.key,
                label: instrument.label,
                samples: instrument.samples
            });
            this.lib[instrument.key] = smi;

            // connect instruments to FFT analyzer
            smi.fan(this.fft).toMaster();
            
            // expected a return value from arrow func
            return true;
        })
      
        this.setInstrument(InitPreset.instrument)

        // console.log('<InstrumentLib>done constructor')

    }

    setInstrument(instrument) {
        if (!instrument || !instrument.key || this.lib[instrument.key] === undefined) {
            throw new Error("InstrumentLib has no such instrument with given key: " + instrument.key)
        }
        this.currentInstrument = instrument.key;
    }

    getInstrument() {
        if (this.lib[this.currentInstrument] === undefined) {
            throw new Error("There is no such instrument in InstrumentLib: " + this.currentInstrument)
        }
        return this.lib[this.currentInstrument];
    }
}
export default InstrumentLib;
