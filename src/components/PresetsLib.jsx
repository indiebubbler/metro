import {PlayModes} from "./PlayModes"
import {PlaybackModes} from "./PlaybackModes"
import { Instruments }  from "./Instruments"; // TODO get rid of old lowercase 'instruments'

export const PresetsLib = [
    {
        title: "4 beats every 4 bars",
        instrument: Instruments.METRONOME,
        beatsPerStep: 4,
        playMode: PlayModes.BY_BAR,
        interval: 4,
        bpmStep: 20,
        bpmRange: [100, 400],
        accents: [0, 1, 2, 1]
    },
    {
        title: "Jhaptal tabla",
        instrument: Instruments.TABLA,
		beatsPerStep: 10,
		bpmRange: [200, 400],
        accents: [0, 1, 0, 0, 1, 2, 1, 0, 0, 1 ],
        playMode: PlayModes.BY_TIME,
        interval: 5*60,
        bpmStep: 10
    },
    {title: "Balkan 1", "bpmRange":[241,400],"beatsPerStep":7,"accents":[0,1,2,0,1,2,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_bar","interval":20,"bpmStep":30},
    {title: "Balkan 2", "bpmRange":[293,400],"beatsPerStep":7,"accents":[0,1,2,0,1,2,1],"instrument":Instruments.TABLA,"playMode":"by_bar","interval":300,"bpmStep":50},
    {title: "Groove 1", "bpmRange":[222,262],"beatsPerStep":8,"accents":[0,2,1,2,1,0,1,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_time","interval":600,"bpmStep":50},
    {title: "Groove 2", "bpmRange":[222,400],"beatsPerStep":8,"accents":[0,2,0,2,2,2,0,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_bar","interval":20,"bpmStep":50},


];

export const InitPreset = {
    title: "INIT",
    instrument: Instruments.METRONOME,
    // beatsPerStep: 5,
    bpmRange: [100, 400],
    accents: [1, 0, 0, 0],
    // accents: [1, 0, 0, 0,0 ,0,0,0,0],
    playMode: PlayModes.BY_BAR,
    playbackMode: PlaybackModes.STOP,
    // interval: 10,
    byTimeInterval: 5,
    byBarInterval: 2,
    // constantBpmSlider: 300,
    bpmStep: 50,
    isHidden: true
}
