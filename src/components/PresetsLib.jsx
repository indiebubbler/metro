import {PlayModes} from "./PlayModes"
import {PlaybackModes} from "./PlaybackModes"
import { Instruments }  from "./Instruments"; // TODO get rid of old lowercase 'instruments'

export const PresetsLib = [
    {
        title: "4 beats every 4 bars",
        instrumentKey: Instruments.METRONOME.key,
        beatsPerStep: 4,
        playMode: PlayModes.BY_BAR,
        interval: 4,
        bpmStep: 20,
        bpmRange: [100, 400],
        track: [[0],[1],[1],[1]]
    },
    {
        title: "Levee Break",
        instrumentKey: 'electrokit',
        bpmRange: [300, 400],
        track: [[0,1],[0],[1],[],[1,2],[],[1],[0],[1],[],[0,1],[0],[1,2],[],[1],[]],
        // accents: [1, 0, 0, 0,0 ,0,0,0,0],
        playMode: PlayModes.BY_BAR,
        playbackMode: PlaybackModes.STOP,
        byTimeInterval: 5,
        byBarInterval: 2,
        stepsNum: 10,
        exerciseTime: 60,
        // constantBpmSlider: 300,
        bpmStep: 50,
        isHidden: true
    },
    {"bpmStep":50,"bpmRange":[300,400],"currentBpm":300,"playbackMode":"stop","playMode":"by_bar","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":5,"byBarInterval":2,"constantBpmSlider":300,"track":[[0,1],[],[0,1],[],[2,1],[],[0,1],[],[1,0],[],[1,0],[],[1,2],[],[1,0],[]],"instrumentKey":"electrokit","title":"Basic Rock"},
    {"bpmStep":50,"bpmRange":[300,400],"currentBpm":300,"playbackMode":"stop","playMode":"by_bar","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":5,"byBarInterval":2,"constantBpmSlider":300,"track":[[0,1],[],[1],[],[2,1],[],[1],[0,1],[1,0],[],[0,1],[],[1,2],[],[1,0],[]],"instrumentKey":"electrokit","title":"Impeach the President"},
    {"bpmStep":50,"bpmRange":[350,600],"currentBpm":300,"playbackMode":"stop","playMode":"by_time","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":60,"byBarInterval":10,"constantBpmSlider":300,"track":[[0,2],[2],[0,2],[2],[2,1],[2],[0,2],[3,1],[2],[2,1],[0,2],[2,1],[2,1],[0,3],[2],[2,1]],"instrumentKey":"basicdrumkit","title":"Funky Drummer"},
    {"bpmStep":50,"bpmRange":[300,400],"currentBpm":300,"playbackMode":"stop","playMode":"by_bar","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":5,"byBarInterval":2,"constantBpmSlider":300,"track":[[0,1],[],[1],[],[1,2],[],[1],[0],[1,0],[],[0,1],[],[1,2],[],[1],[]],"instrumentKey":"electrokit","title":"Walk This Way"},
    {"bpmStep":50,"bpmRange":[300,400],"currentBpm":300,"playbackMode":"stop","playMode":"by_bar","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":5,"byBarInterval":2,"constantBpmSlider":300,"track":[[0,1],[],[1,0],[],[1,2],[],[1],[],[1],[],[0,1],[0],[1,2],[],[1],[0]],"instrumentKey":"electrokit","title":"It's a New Day"},
    {"bpmStep":50,"bpmRange":[300,400],"currentBpm":300,"playbackMode":"stop","playMode":"by_bar","stepsNum":10,"exerciseTime":1800,"bpmStepDropdownOpen":false,"byTimeInterval":5,"byBarInterval":2,"constantBpmSlider":300,"track":[[0],[],[],[0],[1,2],[],[0],[],[0],[],[],[],[1,2],[],[],[]],"instrumentKey":"electrokit","title":"The Big Beat"},
    
    // ancient ones, but leave them for compaitibility
    {title: "Balkan 1", "bpmRange":[241,400],"beatsPerStep":7,"accents":[0,1,2,0,1,2,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_bar","interval":20,"bpmStep":30},
    {title: "Balkan 2", "bpmRange":[293,400],"beatsPerStep":7,"accents":[0,1,2,0,1,2,1],"instrument":Instruments.TABLA,"playMode":"by_bar","interval":300,"bpmStep":50},
    {title: "Groove 1", "bpmRange":[222,262],"beatsPerStep":8,"accents":[0,2,1,2,1,0,1,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_time","interval":600,"bpmStep":50},
    {title: "Groove 2", "bpmRange":[222,400],"beatsPerStep":8,"accents":[0,2,0,2,2,2,0,1],"instrument":Instruments.ELECTRO_KIT,"playMode":"by_bar","interval":20,"bpmStep":50},

];

export const InitPreset = {
    title: "INIT",
    instrumentKey: 'tabla',
    bpmRange: [300, 400],
    track: [[0,1],[0],[1],[],[1,2],[],[1],[0],[1],[],[0,1],[0],[1,2],[],[1],[]],    // Levee Break
    // accents: [1, 0, 0, 0,0 ,0,0,0,0],
    playMode: PlayModes.BY_BAR,
    playbackMode: PlaybackModes.STOP,
    byTimeInterval: 5,
    byBarInterval: 2,
    stepsNum: 10,
    exerciseTime: 60,
    // constantBpmSlider: 300,
    bpmStep: 50,
    isHidden: true
}
