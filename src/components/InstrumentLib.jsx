import { Component } from "react";
import SoundMachineInstrument from "./SoundMachineInstrument"
import { InitPreset } from "./PresetsLib";
import {InstrumentsByKey} from "./Instruments"

class InstrumentLib extends Component {
    state = {};
    lib = {};
    currentInstrumentKey = undefined
    fft = undefined


    constructor(props) {
        super(props);
        // this.fft = new Tone.FFT(128);

        //Tone.Buffer.on("load", () => this.onBufferLoaded());
        
        // InstrumentsArray.map((instrument) => {
        //     var smi = new SoundMachineInstrument({
        //         key: instrument.key,
        //         label: instrument.label,
        //         samples: instrument.samples
        //     });
        //     this.lib[instrument.key] = smi;

        //     // connect instruments to FFT analyzer
        //     // smi.fan(this.fft).toMaster();
            
        //     // expected a return value from arrow func
        //     return true;
        // })

        this.setInstrument(InitPreset.instrumentKey)
    }


    loadInstrument(instrumentKey) {
        if (InstrumentsByKey[instrumentKey] === undefined) {
            throw new Error("Invalid instrumentKey: " + instrumentKey)
        }
        new SoundMachineInstrument(InstrumentsByKey[instrumentKey], (smi) => this.onInstrumentReady(smi));
    }

    onInstrumentReady(smi) {
        this.lib[smi.key] = smi;
        this.currentInstrumentKey = smi.key;
        smi.toMaster()
        this.props.onInstrumentReady(smi)
    }


    hasInstrument(instrumentKey) {
        return this.lib[instrumentKey] !== undefined;
    }

    
    setInstrument(instrumentKey) {
        if (this.lib[instrumentKey] === undefined) {
            this.loadInstrument(instrumentKey)    
        }
        else {
            this.currentInstrumentKey = instrumentKey;
            return this.getInstrument();
        }
        
    }

    getInstrument(instrumentKey) {
        if (this.lib[instrumentKey] === undefined) {
            throw new Error("Instrument not loaded " + instrumentKey)
        }
        return this.lib[instrumentKey]
    }

}
export default InstrumentLib;
