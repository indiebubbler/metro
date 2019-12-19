import { Component } from "react";
import SoundMachineInstrument from "./SoundMachineInstrument"
import Tone from 'tone'
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

        // console.log('<InstrumentLib>done constructor')

    }

    // setInstrument(instrumentKey) {
    //     if (this.lib[instrumentKey] === undefined) {
    //         throw new Error("InstrumentLib has no such instrument with given key: " + instrumentKey)
    //     }
    //     this.currentInstrumentKey = instrumentKey;
    //     return this.getInstrument();
    // }

    loadInstrument(instrumentKey) {
        console.log('loadInstrument', instrumentKey)        
        if (InstrumentsByKey[instrumentKey] === undefined) {
            throw new Error("Invalid instrumentKey: " + instrumentKey)
        }

        // InstrumentsByKey[instrumentKey].onReady = (smi) => this.onInstrumentReady(smi)
        const instrument = new SoundMachineInstrument(InstrumentsByKey[instrumentKey], (smi) => this.onInstrumentReady(smi));
    }

    onInstrumentReady(smi) {
        console.log('instrument loaded', smi.key)
        this.lib[smi.key] = smi;
        this.currentInstrumentKey = smi.key;
        smi.toMaster()
        this.props.onInstrumentReady(smi)
        // return smi;
    }

    // loadInstrument_old(instrumentKey) {
    //     let newInstrument  = new Promise(
    //         function(resolve, reject) {
    //             var smiNew = new SoundMachineInstrument(]
    //             });
    //             resolve(smiNew)
    //         }
    //     )
    //     newInstrument.then((fullfilled) => function(fullfilled) {
    //         console.log('loaded', fullfilled)
    //         debugger
    //         this.currentInstrumentKey = instrumentKey;
    //         return this.getInstrument();
    //     })
    // }

    hasInstrument(instrumentKey) {
        return this.lib[instrumentKey] !== undefined;
    }

    
    setInstrument(instrumentKey) {
        if (this.lib[instrumentKey] === undefined) {
            this.loadInstrument(instrumentKey)    
            // throw new Error("InstrumentLib has no such instrument with given key: " + instrumentKey)
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
    getInstrument_o() {
        if (this.lib[this.currentInstrumentKey] === undefined) {
            this.loadInstrument(this.currentInstrumentKey)
            // throw new Error("There is no such instrument in InstrumentLib: " + this.currentInstrumentKey)
        }
        else {
            return this.lib[this.currentInstrumentKey];
        }
    }
}
export default InstrumentLib;
