import { Sampler } from 'tone'
import { AccentNotes } from './AccentTypes';


class SoundMachineInstrument extends Sampler {

    constructor(props, onReadyCb) {
        
        if (props.samples.length > AccentNotes.length) {
            throw new Error("Limited to " + AccentNotes.length + " samples per instrument")
        }

        let samplerMapping = {}
        props.samples.map(function (item, idx) {
            samplerMapping[ AccentNotes[idx] ] = item.file;
            // expected to return a value in function
            return true;
        })

        super(samplerMapping, {
            baseUrl: props.baseUrl || './audio/' + props.key + '/',
            onload: () => onReadyCb(this)
        });
        this.key = props.key;
        this.label = props.label;
        this.samples = props.samples;
    }
}

export default SoundMachineInstrument;

SoundMachineInstrument.defaultProps = {
    onReady: function () { }
}