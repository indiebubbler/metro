
const ColorThemes = {
    'ambient' : {
        3: '#FF6355',
        2: '#E1537F',
        1: '#AC5696',
        0: '#705A94'
        // 1: '#40557B',
        // 0: '#2F4858'
    },
    'blueish' : {
        0: '#D1D2F9',
        1: '#A3BCF9',
        2: '#7796CB',
        3: '#576490'
    },
    'rainbow': {
        0: '#FF715B',
        1: '#F9CB40',
        2: '#BCED09',
        3: '#2F52E0'
    }
}

const Config = {
    TRACKS_NUMBER: 4,
    MAXIMUM_TIMESIGNATURE: 24,
    MIN_BPM: 10,
    MAX_BPM: 1200,
    PROGRESS_UPDATE_FPS: 30, // TODO: Set this according to device. higher values might cause slower devices to stutter
    COLOR_PALETTE: ColorThemes['rainbow']
}
export default Config;


// old 
// 0: '#ff6355',
// 	1: '#ff7155',
// 	2: '#ff8055',
// 	3: '#ff8e55',
// 	4: '#ff9955',
// 	5: '#ff9c55',
// 	6: '#ffaa55'