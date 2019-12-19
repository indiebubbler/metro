import { Sampler } from 'tone'
import { accentTypesArr, AccentNotes } from './AccentTypes';


class SoundMachineInstrument extends Sampler {

    constructor(props, onReadyCb) {
        // console.log('<SoundMachineInstrument>constructor', props.key)
        
        if (props.samples.length > AccentNotes.length) {
            throw new Error("Limited to " + AccentNotes.length + " samples per instrument")
        }

        let samplerMapping = {}
        props.samples.map(function (item, idx) {
            samplerMapping[ AccentNotes[idx] ] = item.file;
        })

        // var o = {
        //     "C3": props.samples[0].file,
        //     "C#3": props.samples[1].file,
        //     "D3": props.samples[2].file,
        // };
        
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