import { Sampler } from 'tone';
// import InstrumentLib

class TrackInstrument extends Sampler {
    instrumentKey = null;
    filename = null;

    constructor(props) {
        this.instrumentKey = props.instrumentKey;
        this.filename = props.filename


        // super(samplerMapping, {
        //     baseUrl: props.baseUrl || './audio/' + props.instrumentKey + '/',
        //     onload: () => onReadyCb(this)
        // });

        
    }
}

export default TrackInstrument