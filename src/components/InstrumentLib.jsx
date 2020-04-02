import { Component } from "react";
import { InitPreset } from "./PresetsLib";

class InstrumentLib extends Component {
    state = {};
    lib = {};
    currentInstrumentKey = undefined
    fft = undefined


    constructor(props) {
        super(props);
        this.setInstrument(InitPreset.instrumentKey)
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
