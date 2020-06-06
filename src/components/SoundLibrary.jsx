import Tone from 'tone'
import { Samples, InstrumentsByKey } from './Instruments';

class SoundLibrary  {
    players = new Tone.Players({})
    playersArr = []; 
  
    reverb = new Tone.Reverb().toMaster();

    constructor(props) {
        // this is required for convolution rever to generate IR profile
        this.reverb.decay = 4;
        this.reverb.predelay = 0.05;
        this.reverb.generate();

        this.reverb.wet.value = 0;
        this.players.connect(this.reverb);
        this.players.toMaster();
    }

   
    use(idx, instrumentKey, file) {
        const instrument = InstrumentsByKey[instrumentKey];

        console.log('process', process)
        this.players.add('player_' + idx, './audio/' + instrumentKey + '/' + file);// (player) => this.onLoad(player));
        
        let player = this.players.get('player_' + idx);
        player.instrument = instrument;
        player.file = file;
        player.idx = idx;
        player.fullLabel = Samples.find(el => el.file === file).label;
        this.playersArr[idx] = player;
    }

    getSamples() {
        let samples = [];
        this.playersArr.map(player => {
            samples.push({
                file: player.file,
                instrumentKey: player.instrument.key
            })
            // expected to return value from arrow func
            return true;
        });
        return samples;
    }

    play(trackIdx, time) {
        const player = this.playersArr[trackIdx];
        if (player && player.loaded) {
            player.start(time);
        }
    }

    setReverb(wet) {
        this.reverb.wet.value = wet;
    }
}
export default SoundLibrary;