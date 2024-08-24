export const ColorThemes = {
  ambient: {
    0: "#705A94",
    1: "#AC5696",
    2: "#E1537F",
    3: "#FF6355",
  },
  blueish: {
    0: "#D1D2F9",
    1: "#A3BCF9",
    2: "#7796CB",
    3: "#576490",
  },
  rainbow: {
    0: "#FF715B",
    1: "#F9CB40",
    2: "#BCED09",
    3: "#2F52E0",
  },
  muted: {
    0: "#AE5571",
    1: "#AE5571",
    2: "#AE5571",
    3: "#AE5571",
  },
};

const Config = {
  TRACKS_NUMBER: 4,
  MAXIMUM_TIMESIGNATURE: 24,
  MIN_BPM: 10,
  MAX_BPM: 1200,
  COLOR_PALETTE: ColorThemes["muted"],
};

export default Config;

