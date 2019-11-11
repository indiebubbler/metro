import React, { Component } from "react";
import "./App.css";
import "./components/SoundMachine";
import SoundMachine from "./components/SoundMachine";
import Planner from "./components/Planner";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";
// import PresetsManager from "./components/PresetsManager";
import { PlayModes } from "./components/PlayModes";
import { withCookies } from "react-cookie";
import { PresetsLib, InitPreset } from "./components/PresetsLib";
import SimplePanel from "./components/SimplePanel";
// import Vis from "./components/Vis"
import VisClock from "./components/VisClock"
import { PlaybackModes } from "./components/PlaybackModes";
import ReactGA from 'react-ga';


class App extends Component {
	state = {
		// currentBpm: 60,
		// instrument: InitPreset.instrument,
		// instrumentDropdownOpen: false,
		// instrumentDropdownLabel: InitPreset.instrumentLabel,
		// cycleDropdownOpen: false
	};

	playbackDirection = true; // true => forward, false => backward

	componentDidMount() {
		// initialize accents
		// this.refs.sm.setAccents(this.refs.playbackPanel.getAccents());

		// keyboard listeners
		document.addEventListener("keydown", e => this.handleKeyDown(e));

		//this.refs.sm.setVis(this.refs.vis);

		ReactGA.initialize({
			trackingId: 'UA-151010848-1',
			debug: true,
			gaOptions: {
				cookieDomain: 'none'
			}
		});
		ReactGA.pageview(window.location.pathname + window.location.search);

		
	 	// this.refs.planner.setStep(0);
	}


	handleKeyDown(e) {
		switch (e.keyCode) {
			case 32: // space
				// if you prevent you won't be able to use space in preset name...
				// e.preventDefault();
				// advance plan or toggle
				this.refs.sm.state.isPlaying ? this.refs.sm.refs.planner.stepForward() : this.refs.sm.toggle();
				break;
			case 27: // 
				this.refs.sm.stop();
				// this.refs.sm.refs.planner.resetStep()
				
				break;
			case 38: // Arrow up
				e.preventDefault();
				
				if (this.refs.sm.state.bpm < 600) {
					this.refs.sm.setBpm(this.refs.sm.state.bpm +  10);
				}
				break;
			case 40: // arrow down
				e.preventDefault();
				if (this.refs.sm.state.bpm> 10) {
					this.refs.sm.setBpm(this.refs.sm.state.bpm  - 10);
				}
				break;
			case 37: // Arrow left
				e.preventDefault();
				this.refs.sm.refs.planner.stepBackward();
				break;
			case 39: // Arrow right
				e.preventDefault();
				this.refs.sm.refs.planner.stepForward();
				break;
			default:
		}
	}

	renderBottomPane() {
		return (
			<Container>
				{/* <Row>
					<Col>{this.renderPresetsPane()}</Col>
				</Row> */}
				<Row>
					<Col>
						<SimplePanel title={"Keyboard controls"} className="about">
							<div><code>up/down</code> - adjust tempo</div>
							<div><code>left/right</code> - previous/next step according to plan</div>
							<div><code>space</code> - start/next step</div>
							<div><code>esc</code> - stop</div>
						</SimplePanel>
					</Col>
				</Row>

			</Container>

		);
	}

	// onProgress(progress) {
	// 	this.refs.planner.setProgress(progress)
	// }

	// onBpmChange(bpm) {
	// 	console.log('bpm changed', bpm)
	// 	this.setState({ currentBpm: bpm })
	// }
 
	renderLeftPane() {
		
		return (
			<Container>
				
					<SoundMachine
						ref="sm"
						cookies={this.props.cookies}
						// planner={this.refs.planner}
						// vis={this.refs.visClock}
						beatsPerStep={this.state.beatsPerStep}
						onLoopEnd={() => this.onLoopEnd()}
						// onBeat={beat => this.onBeat(beat)}
						// onBpmChange={bpm => this.onBpmChange(bpm)}
						instrument={this.state.instrument}
						// // onToggle={(state) => this.onSoundMachineToggle(state)}
						// onProgress={(progress) => this.onProgress(progress)}
						// onReady={() => this.onSoundMachineReady()}>
						>
					</SoundMachine>
					
				{/* <Row>
					<Col>
						<ModePanel
							ref="modePanel"
							sm={this.refs.sm}
							planner={this.refs.planner}
							playMode={this.props.playMode}
							interval={this.props.interval}
							bpmStep={this.props.bpmStep}
							bpmRange={this.props.bpmRange}
							//bpmStableSlider={this.props.bpmStableSlider}
							currentBpm={this.state.currentBpm}
							// defaultValue={{playMode: this.props.playMode, interval: this.props.interval, bpmStep: this.props.bpmStep}}
							// onAfterChange={() => this.onModePanelChanged()}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<PlaybackPanel ref='playbackPanel' sm={this.refs.sm} />
					</Col>
				</Row> */}
			</Container>
		);
	}
 

	// onPresetSelect(preset) {
	// 	// console.log("setting preset", preset);

	// 	this.refs.beatsPerStep.setState({ value: preset.beatsPerStep });
	// 	this.refs.sm.setBeatsPerStep(preset.beatsPerStep);

	// 	// this.onInstrumentSelect(preset.instrument || instruments.TABLA);
	// 	this.refs.sm.setInstrument(preset.instrument)
	// 	this.refs.barManager.setAccents(preset.accents, preset.beatsPerStep);

	// 	this.refs.modePanel.setValue(preset);

	// }

	renderRightPane() {
		return (
			<Container>
				
			</Container>
		);
	}

	onStepEnd() {
		const pm = this.refs.control.refs.modePanel.state.playbackMode;

		switch (pm) {
			case PlaybackModes.CYCLE:
				this.playbackDirection === true ? this.refs.planner.stepForward() : this.refs.planner.stepBackward();

				if (this.refs.planner.isLastStep() || this.refs.planner.isFirstStep()) {
					this.playbackDirection = !this.playbackDirection;
				}

				break;
			case PlaybackModes.REPEAT:
				if (this.refs.planner.isLastStep()) {
					this.refs.planner.setStep(0);
				} else {
					this.refs.planner.stepForward();
				}
				break;
			case PlaybackModes.CONTINUE:
				if (this.refs.planner.isLastStep()) {
					let currentMode = this.refs.modePanel.getValue();
					currentMode.playMode = PlayModes.CONSTANT;
					currentMode.stableBpmSlider = this.state.currentBpm;
					this.refs.modePanel.setValue(currentMode);
				}
				else {
					this.refs.planner.stepForward();
				}
				break;
			case PlaybackModes.STOP:
				if (this.refs.planner.isLastStep()) {
					this.refs.sm.stop();
				}
				else {
					this.refs.planner.stepForward();
				}
				break;
			default:
				this.refs.planner.stepForward();
		}
	}

	// onBeat(idx) {
	// 	this.refs.control.setActiveBeat(idx);
	// }

	render() {
		// set the title with current BPM
		// document.title =
		// 	"BPM: " + this.state.currentBpm.toFixed(0) + " | Free Online Speed Trainer Metronome"

		// render everything else
		return (
			<div className="App">

				<Container className="app-container">
					<Row>
						<Col>
							{this.renderLeftPane()}
						</Col>
						<Col>
							{this.renderRightPane()}
						</Col>
						<Col>
							{this.renderBottomPane()}
						</Col>
					</Row>
					<Row>
						<Col>

							<div className="footer">
								<div>By using this site you agree to the use of cookies to store user defined presets.</div>
								<div>Created using React and <a href="https://tonejs.github.io/" rel="noopener noreferrer" target="_blank">Tone.js</a>. Source code available <a href="https://github.com/indiebubbler/metro">here</a>. <br />Contact dev at <a href="mailto:indiebubbler@gmail.com?subject=Feedback">indiebubbler@gmail.com</a>.</div>
							</div>
						</Col>
					</Row>
				</Container>

			</div>
		);
	}

	// onBeatsPerStepChange = () => {
	// 	// plan doesn't change here, just the beats per step amount
	// 	const newBps = this.getUiState().beatsPerStep;

	// 	if (newBps !== this.refs.sm.beatsPerStep) {
	// 		const accents = this.refs.barManager.getAccents();

	// 		while (accents.length > newBps) {
	// 			accents.pop();
	// 		}
	// 		while (accents.length < newBps) {
	// 			accents.push(accentTypes.ACCENT_2);
	// 		}

	// 		this.refs.sm.setBeatsPerStep(newBps);
	// 		this.refs.barManager.setAccents(accents);
	// 		this.setState({ beatsPerStep: newBps });
	// 	}
	// };

	onPlanStep(step) {
		console.log('onPlanStep', step)
		if (!step) {
			throw new Error("Step not defined")
		}

		this.refs.sm.executeStep(step);

		// console.log('step.bpm', step.bpm);

		// this.setState({ currentBpm: step.bpm });
	}


	setBpm = newBpm => {
		console.log('setting new bpm', newBpm)

		this.refs.sm.setBpm(newBpm);
		this.setState({ currentBpm: newBpm });
	};

	// onInstrumentChange() {
	// 	this.setState(prevState => ({
	// 		instrumentDropdownOpen: !prevState.instrumentDropdownOpen
	// 	}));
	// }


	getUiState() {

		// const state = this.refs.control.state;
		
		const s1 = this.refs.control.refs.playbackPanel.state;// this.refs.playbackPanel.state;
		// const s1 = {
		// 	beatsPerStep: this.refs.beatsPerStep.getValue(),
		// 	accents: this.refs.barManager.getAccents(),
		// 	instrument: this.state.instrument
		// };
		// debugger
		const s2 = this.refs.control.refs.modePanel.getValue();
		// console.log('s2',s2.playbac)
		const uiState = { ...s1, ...s2 };

		// console.log("storing uiState", this.uiState);
		this.uiState = uiState;
		// HACK


		this.uiState.instrument = this.state.instrument;
		// console.log('uiState instrument',this.uiState.instrument)
		return uiState;
	}

	onAccentsChange(accents) {
		debugger
		this.refs.sm.setAccents(this.refs.barManager.getAccents());
	}
}

export default withCookies(App);

// this serves as default app settings
App.defaultProps = {
	playbackMode: InitPreset.playbackMode,
	playMode: InitPreset.playMode,// playModes.BY_BAR,
	interval: InitPreset.interval,
	instrument: InitPreset.instrument,
	bpmStep: InitPreset.bpmStep,
	bpmRange: InitPreset.bpmRange,
	beatsPerStep: InitPreset.beatsPerStep,
	accents: InitPreset.accents
};

// App.defaultProps = {...App.defaultProps, InitPreset}
