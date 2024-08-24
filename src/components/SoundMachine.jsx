import React, { Component } from "react";
import Tone from "tone";
import { Container, Row, Col } from "reactstrap";
import { Button } from "reactstrap";
import { InitPreset } from "./PresetsLib";
import Planner from "./Planner";
import Tr from "./Locale";
import PresetsManager from "./PresetsManager";
import SvgClock from "./SvgClock";
import ModePanel from "./ModePanel";
import TrackView from "./TrackView/TrackView";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Config from "./Config";
import SoundLibrary from "./SoundLibrary";
import AdvancedSlider from "./Sliders/AdvancedSlider";
import { PlayModes } from "./PlayModes";
import { debounce } from "lodash";

class SoundMachine extends Component {
  soundLibrary = new SoundLibrary();

  state = {
    initialized: false,
    config: {
      ...InitPreset,
      playMode: this.props.initialPlayMode || PlayModes.CONSTANT,
    },
    track: this.props.track,
    timeSignature: this.props.timeSignature,
    isPlaying: false,
    bpm: Tone.Transport.bpm.value,
    showClock: true,
  };

  transport = Tone.Transport;
  tone = Tone;

  componentDidMount() {
    Tone.Transport.lookAhead = 10;

    // initialize main loop
    this.part = new Tone.Part((time, note) => this.repeat(time, note), []);
    this.part.loop = true;
    // this.part.humanize = true;
    this.part.start(0);

    const config = this.getConfig();
    this.setPlan(config);

    this.initProgressUpdate();
    this.documentTitle = document.title;

    this.setState({ initialized: true }, () => {
      this.refs.modePanel.setValue({
        ...this.refs.modePanel.state,
        playMode: this.state.config.playMode,
      });
      this.props.onReady();
    });
  }

  getConfig() {
    return {
      ...this.refs.modePanel.state,
      ...{ track: this.state.track },
      ...{ timeSignature: this.state.timeSignature },
      ...{ samples: this.soundLibrary.getSamples() },
    };
  }

  initProgressUpdate() {
    let lastTime = 0;
    const animateProgress = (time) => {
      if (time - lastTime >= 1000 / 60) {  // Cap at 60 FPS
        this.onProgress();
        lastTime = time;
      }
      this.animationFrameId = requestAnimationFrame(animateProgress);
    };
    this.animationFrameId = requestAnimationFrame(animateProgress);
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  setPlan(config) {
    // cancel all events
    this.transport.cancel();
    this.transport.position = 0;
    this.setTrack(config.track.slice(), config.timeSignature); // TODO: Unsure why we need to pass copy
    this.refs.planner.setPlan(config);
  }

  // trackRow.length determine polyrhythm measure, timeSignature is main time signature we relate polyrythms to
  createPoly(trackRow, trackIdx, timeSignature) {
    const ticks = this.tone.Time("1m").toTicks();
    const interval = ticks / trackRow.length;

    for (let i = 0; i < trackRow.length; i++) {
      if (trackRow[i] > 0) {
        this.part.add(interval.toFixed(0) * i + "i", trackIdx);
      }
    }
  }

  setTrack(track, timeSignature) {
    if (this.state.track === track) {
      return;
    }

    // make sure we have 4 tracks
    if (track.length < Config.TRACKS_NUMBER) {
      track.push(new Array(timeSignature).fill(0));
    }
    this.setTimeSignature(timeSignature);

    this.part.removeAll();

    for (let i = 0; i < track.length; i++) {
      this.createPoly(track[i], i, timeSignature);
    }
    this.part.loopEnd = "1m";
    this.part.start(0);

    this.setState({ track: track, timeSignature: timeSignature });
  }

  onProgress() {
    if (this.transport.state === "stopped") {
      return;
    }
    if (this.refs.debug) {
      this.refs.debug.innerHTML = this.transport.seconds.toFixed(1);
    }

    if (this.refs.planner) {
      this.refs.planner.updateProgress();
    }

    if (this.state.showClock && this.refs.svgClock) {
      this.refs.svgClock.setProgress(this.part.progress);
    }
    this.refs.trackView.setProgress(this.part.progress);
  }

  repeat = (time, trackIdx) => {
    this.soundLibrary.play(trackIdx, time);
  };

  calcTimeForBpm(seconds, bpm) {
    return Tone.Time((seconds * bpm) / this.baseBpm);
  }

  setTimeSignature(timeSignature) {
    if (timeSignature !== this.transport.timeSignature) {
      this.transport.timeSignature = timeSignature;
    }
  }

  setBpm = debounce((bpm) => {
    if (isNaN(bpm) || bpm <= 0 || bpm > 1200) {
      throw new Error("Invalid BPM value: " + bpm);
    }

    if (bpm !== this.transport.bpm.value) {
      Tone.Transport.bpm.rampTo(bpm, 0.1); // Smooth transition
      document.title = bpm.toFixed(0) + " | " + this.documentTitle;
      this.setState({ bpm: bpm }, () => {
        if (this.props.onBpmChange) {
          this.props.onBpmChange(bpm);
        }
        this.triggerBpmAnimation();
      });
    }
  }, 100);

  triggerBpmAnimation = () => {
    const bpmInfo = document.getElementById("bpm-display");
    if (bpmInfo) {
      bpmInfo.classList.add("bump");
      setTimeout(() => bpmInfo.classList.remove("bump"), 300);
    }
  };

  toggle() {
    if (Tone.Transport.state === "started") {
      this.stop();
    } else {
      this.start();
    }
  }

  onPlanStep(bpm) {
    this.setBpm(bpm);
  }

  onControlChange() {
    const v = this.getConfig();
    this.setPlan(v);
  }

  onPresetSelect(preset) {
    // set preset's stuff
    this.setState(
      { track: preset.track, timeSignature: preset.timeSignature },
      function () {
        this.refs.modePanel.setValue(preset);
      }
    );

    // set instruments
    for (let i = 0; i < preset.samples.length; i++) {
      this.soundLibrary.use(
        i,
        preset.samples[i].instrumentKey,
        preset.samples[i].file
      );
    }
  }

  onTrackChange(newTrack, timeSignature) {
    if (this.state.timeSignature !== timeSignature) {
      // length changed so after setting track, recreate Plan
      const config = this.getConfig();
      config.track = newTrack;
      config.timeSignature = timeSignature;
      this.setPlan(config);
    } else {
      this.setTrack(newTrack, timeSignature);
    }
  }

  onVolumeChange(newVolume) {
    this.tone.Master.volume.value = -60 + (newVolume * 60) / 100 + 6;
  }

  onReverbChange(value) {
    this.soundLibrary.setReverb(value / 100);
  }

  toggleClockVisibility = () => {
    this.setState(prevState => ({ showClock: !prevState.showClock }), () => {
      // Force a re-render of the TrackView to adjust its size
      this.forceUpdate();
    });
  }

  handleKey(key, e) {
    e.preventDefault();
    switch (key) {
      case "s":
      case "space":
        this.toggle();
        break;
      case "esc":
        this.stop();
        break;
      case "left":
        this.refs.planner.stepBackward();
        break;
      case "right":
        this.refs.planner.stepForward();
        break;
      case "up":
        if (this.state.bpm < 1200) {
          this.setBpm(this.state.bpm + 1);
        }
        break;
      case "down":
        if (this.state.bpm > 10) {
          this.setBpm(this.state.bpm - 1);
        }
        break;
      case "shift+up":
        if (this.state.bpm < 1200) {
          this.setBpm(this.state.bpm + 10);
        }
        break;
      case "shift+down":
        if (this.state.bpm > 10) {
          this.setBpm(this.state.bpm - 10);
        }
        break;
      default:
        break;
    }
  }
  renderControlPanel() {
    return (
      <>
        <Button
          onClick={() => this.toggle()}
          color={this.state.isPlaying ? "secondary" : "light"}
        >
          <i
            className={`fas fa-${this.state.isPlaying ? "pause" : "play"}`}
          ></i>
        </Button>
        <span className="bpm-info" id="bpm-display">
          BPM: {Math.round(this.state.bpm).toString().padStart(3, "0")}
        </span>
        <div className="d-flex align-items-center">
          <span className="mr-2">{Tr("Volume")}</span>
          <AdvancedSlider
            ref="volumeSlider"
            min={0}
            disableBtns={true}
            btnStep={1}
            max={100}
            defaultValue={90}
            onChange={(newVolume) => this.onVolumeChange(newVolume)}
          />
        </div>
        <div className="d-flex align-items-center">
          <span className="mr-2">{Tr("Reverb")}</span>
          <AdvancedSlider
            ref="reverbSlider"
            min={0}
            disableBtns={true}
            btnStep={1}
            max={100}
            defaultValue={0}
            onChange={(newVolume) => this.onReverbChange(newVolume)}
          />
        </div>
        <Button
          onClick={this.toggleClockVisibility}
          color="light"
        >
          <i className={`fas fa-${this.state.showClock ? 'eye-slash' : 'eye'}`}></i>
        </Button>
      </>
    );
  }

  render() {
    return (
      <>
        <KeyboardEventHandler
          handleKeys={[
            "s",
            "space",
            "esc",
            "left",
            "right",
            "up",
            "down",
            "shift+up",
            "shift+down",
          ]}
          onKeyEvent={(key, e) => this.handleKey(key, e)}
        />
        <Container>
          <Row>
            <Col xs={this.state.showClock ? 6 : 12}>
              <TrackView
                ref="trackView"
                soundLibrary={this.soundLibrary}
                track={this.state.track}
                instrument={this.state.instrument}
                timeSignature={this.state.timeSignature}
                onChange={(track, timeSignature) =>
                  this.onTrackChange(track, timeSignature)
                }
              />
            </Col>
            {this.state.showClock && (
              <Col xs={6} style={{ margin: "auto" }}>
                <SvgClock
                  ref="svgClock"
                  soundLibrary={this.soundLibrary}
                  timeSignature={this.state.timeSignature}
                  track={this.state.track}
                />
              </Col>
            )}
          </Row>
          <Row>
            <ModePanel
              ref="modePanel"
              transport={this.transport}
              onChange={() => this.onControlChange()}
            />
          </Row>
          <Row>
            <Col>
              <Planner
                transport={this.transport}
                onChange={() => this.onControlChange()}
                onPlanStep={(bpm) => this.onPlanStep(bpm)}
                onPlanEnd={() => this.stop()}
                ref="planner"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <PresetsManager
                ref="presetsManager"
                getPreset={() => this.getConfig()}
                onSelect={(preset) => this.onPresetSelect(preset)}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  stop() {
    this.transport.stop();
    this.transport.position = 0;
    this.setState({ isPlaying: false });
  }

  start() {
    this.transport.start("+.1");
    this.part.start();
    this.setState({ isPlaying: true });
  }
}

export default SoundMachine;

SoundMachine.defaultProps = {
  instrument: InitPreset.instrument,
  track: InitPreset.track,
  timeSignature: InitPreset.timeSignature,
  initialPlayMode: PlayModes.CONSTANT,
  onReady: function () {},
};
