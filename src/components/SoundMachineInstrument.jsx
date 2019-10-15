import {Sampler} from 'tone'


class SoundMachineInstrument extends Sampler {

    constructor(props) {
        // console.log('<SoundMachineInstrument>constructor', props.key)
        var o = {
            "C3" : props.samples[0],
            "C#3" : props.samples[1],
            "D3" : props.samples[2],
        };
        super(o,{
            baseUrl: props.baseUrl || './audio/' + props.key + '/'
        });
        this.key = props.key;
        this.label = props.label;
    }
}

export default SoundMachineInstrument;

 