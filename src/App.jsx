import React, { Component } from "react";
import "./App.css";
import "./components/SoundMachine";
import SoundMachine from "./components/SoundMachine";
import Planner from "./components/Planner";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";
import {
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from "reactstrap";
import AdvancedSlider from "./components/AdvancedSlider";
import BarManager from "./components/BarManager";
import { instruments } from "./components/InstrumentLib";
import PresetsManager from "./components/PresetsManager";
import ModePanel from "./components/ModePanel";
import { playModes } from "./components/PlayModes";
import { withCookies } from "react-cookie";
import { PresetsLib, InitPreset } from "./components/PresetsLib";
import { accentTypes } from "./components/AccentTypes";
import SimplePanel from "./components/SimplePanel";
import Vis from "./components/Vis"
import { playbackModes } from "./components/PlaybackModes";

class App extends Component {
	state = {
		currentBpm: 60,
		instrument: instruments.ELECTRO_KIT,
		instrumentDropdownOpen: false,
		instrumentDropdownLabel: "Electro kit", // bit messy, why would we hardcode this here, it ought to be taken from instrumentLib
		cycleDropdownOpen: false
	};

	playbackDirection = true; // true => forward, false => backward

	componentDidMount() {
		// initialize accents
		this.refs.sm.setAccents(this.refs.barManager.getAccents());

		// keyboard listeners
		document.addEventListener("keydown", e => this.handleKeyDown(e));

		// initialize with UI settings
		this.refs.planner.setPlan(this.getUiState());

		// this.refs.sm.setBpm(this.state.currentBpm)
		// this.initialized = true;

		this.refs.sm.setVis(this.refs.vis)
	}


	handleKeyDown(e) {
		// console.log("key", e);
		switch (e.keyCode) {
			case 32: // space
				// e.preventDefault();
				if (this.refs.sm.state.isPlaying) {
					this.refs.planner.stepForward();
				}
				else {
					this.refs.sm.handleStartStop();
				}
				// if (this.state.keysActive) {
				// 	e.preventDefault();
				// }

				break;
			case 38: // Arrow up
				e.preventDefault();
				if (this.state.currentBpm < 600) {
					this.setBpm(this.state.currentBpm + 10);
				}
				break;
			case 40: // arrow down
				e.preventDefault();
				if (this.state.currentBpm > 10) {
					this.setBpm(this.state.currentBpm - 10);
				}
				break;
			case 37: // Arrow left
				e.preventDefault();
				this.refs.planner.stepBackward();
				break;
			case 39: // Arrow right
				e.preventDefault();
				this.refs.planner.stepForward();
				break;
			default:
		}
	}

	onInstrumentSelect(newInstrument) {
		this.refs.sm.setInstrument(newInstrument);
		const label = this.refs.sm.getCurrentInstrumentLabel();
		// trigger storing current instrument. Bit clunky...


		this.setState({
			instrument: newInstrument,
			instrumentDropdownLabel: label
		}, this.getUiState);


	}


	// TODO: make it automatic
	renderInstrumentsDropDown() {
		return (<ButtonDropdown
			isOpen={this.state.instrumentDropdownOpen}
			toggle={() => this.onInstrumentChange()}
		>
			<DropdownToggle
				caret
				size="sm"
				outline
				color="light"
			>
				{this.state.instrumentDropdownLabel}
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem
					onClick={() => {
						this.onInstrumentSelect(
							instruments.TABLA
						);
					}}
				>
					Tabla
				</DropdownItem>
				<DropdownItem
					onClick={() => {
						this.onInstrumentSelect(
							instruments.ELECTRO_KIT
						);
					}}
				>
					Electro Kit
				</DropdownItem>
				<DropdownItem
					onClick={() => {
						this.onInstrumentSelect(
							instruments.METRONOME
						);
					}}
				>
					Metronome
				</DropdownItem>
			</DropdownMenu>
		</ButtonDropdown>);

	}
	renderPlaybackPane() {
		return (
			<Container className="pane">
				<Row className="pane-title">PLAYBACK</Row>
				<Row>
					<Col xs="3">Instrument</Col>
					<Col>
						{this.renderInstrumentsDropDown()}
					</Col>
				</Row>

				<Row>
					<Col xs={3}>Beats per step</Col>
					<Col>
						<AdvancedSlider
							ref="beatsPerStep"
							min={2}
							max={16}
							defaultValue={this.props.beatsPerStep}
							onAfterChange={() => this.onBeatsPerStepChange()}
						/>
					</Col>
				</Row>

				<Row>
					<Col xs={3}>Accents</Col>
					<Col>
						<BarManager
							onAfterChange={() => this.onAccentsChange()}
							ref="barManager"
							defaultValue={this.props.accents}
						/>
					</Col>
				</Row>

				{/* <Row>
					<Col xs="3">Playback</Col>
					<Col>One Time/LoopBack/Repeat</Col>
				</Row> */}
			</Container>
		);
	}

	onModePanelChanged() {
		// console.log("<App>onModePanelChanged")
		const state = this.getUiState();

		// create new plan
		this.refs.planner.setPlan(state);
	}

	renderBottomPane() {
		return (
			<Container>
				<Row>
					<Col>{this.renderPresetsPane()}</Col>
				</Row>
				<Row>
					<Col>
						<SimplePanel title={"Keyboard controls"} className="about">
							<div><code>up/down</code> - adjust tempo</div>
							<div><code>left/right</code> - previous/next step according to plan</div>
							<div><code>space</code> - start/next step</div>
						</SimplePanel>
					</Col>
				</Row>

				<div className="footer">
					<div>By using this site you agree to the use of cookies to store user defined presets.</div>
					<div>Created using React and <a href="https://tonejs.github.io/" rel="noopener noreferrer" target="_blank">Tone.js</a>. Source code available <a  href="https://github.com/indiebubbler/metro">here</a>. <br/>Contact dev at <a href="mailto:indiebubbler@gmail.com?subject=Feedback">indiebubbler@gmail.com</a>.</div>
				</div>
			</Container>

		);
	}

	onProgress(progress) {
		this.refs.planner.setProgress(progress)
	}

	renderLeftPane() {
		return (
			<Container>
				<Row>
					<Col>
						<SimplePanel title="Control">
							<SoundMachine
								ref="sm"
								beatsPerStep={this.state.beatsPerStep}
								onLoopEnd={() => this.onLoopEnd()}
								onBeat={beat => this.onBeat(beat)}
								instrument={this.state.instrument}
								// onToggle={(state) => this.onSoundMachineToggle(state)}
								onProgress={(progress) => this.onProgress(progress)}
							/>

						</SimplePanel>
					</Col>
				</Row>
				<Row>
					<Col>
						<ModePanel
							ref="modePanel"
							playMode={this.props.playMode}
							interval={this.props.interval}
							bpmStep={this.props.bpmStep}
							bpmRange={this.props.bpmRange}
							//bpmStableSlider={this.props.bpmStableSlider}
							currentBpm={this.state.currentBpm}
							// defaultValue={{playMode: this.props.playMode, interval: this.props.interval, bpmStep: this.props.bpmStep}}
							onAfterChange={() => this.onModePanelChanged()}
						/>
					</Col>
				</Row>

				<Row>
					<Col>{this.renderPlaybackPane()}</Col>
				</Row>
				{/* <Row>
					<Col>{this.renderCyclePane()}</Col>
				</Row> */}
			</Container>
		);
	}

	renderPresetsPane() {
		return (
			<Container className="pane">
				<Row className="pane-title">Presets</Row>
				<PresetsManager
					ref="presetsManager"
					cookies={this.props.cookies}
					presets={PresetsLib}
					getPreset={() => this.getUiState()}
					onSelect={preset => this.onPresetSelect(preset)}
				/>
			</Container>
		);
	}

	onPresetSelect(preset) {
		// console.log("setting preset", preset);

		this.refs.beatsPerStep.setState({ value: preset.beatsPerStep });

		this.refs.sm.setBeatsPerStep(preset.beatsPerStep);

		this.onInstrumentSelect(preset.instrument || instruments.TABLA);

		this.refs.barManager.setAccents(preset.accents, preset.beatsPerStep);

		this.refs.modePanel.setValue(preset);

	}

	renderRightPane() {
		return (
			<Container>
				<Row>
					<Col>
						<SimplePanel title={"Plan"}>
							<Planner
								currentBpm={this.state.currentBpm}
								// onChange={() => this.onPlanChanged()}
								onStep={step => this.onPlanStep(step)}
								ref="planner"
							/>
						</SimplePanel>



					</Col>
				</Row>
				<Row>
					<Col>
						<SimplePanel title={"Visualisation"}>
							<Vis ref="vis" />
						</SimplePanel>
					</Col>
				</Row>


			</Container>
		);
	}

	onLoopEnd() {

		const pm = this.refs.modePanel.state.playbackMode;

		switch (pm) {
			case playbackModes.CYCLE:
				if (this.refs.planner.isLastStep() || this.refs.planner.isFirstStep()) {
					this.playbackDirection = !this.playbackDirection;
				}
				this.playbackDirection === true ? this.refs.planner.stepForward() : this.refs.planner.stepBackward();
				break;
			case playbackModes.REPEAT:
				if (this.refs.planner.isLastStep()) {
					this.refs.planner.setStep(0)
				} else {
					this.refs.planner.stepForward();
				}
				break;
			case playbackModes.CONTINUE:
				if (this.refs.planner.isLastStep()) {
					let currentMode = this.refs.modePanel.getValue();
					currentMode.playMode = playModes.STABLE;
					currentMode.stableBpmSlider = this.state.currentBpm;
					this.refs.modePanel.setValue(currentMode);
				}
				else {
					this.refs.planner.stepForward();
				}
				break;
			case playbackModes.STOP:
				if (this.refs.planner.isLastStep()) {
					this.refs.sm.handleStartStop();
				}
				else {
					this.refs.planner.stepForward();
				}
				break;
			default:
				this.refs.planner.stepForward();
		}
	}

	onBeat(idx) {
		this.refs.barManager.setActive(idx);
	}

	render() {
		// set the title with current BPM
		document.title =
			"BPM: " + this.state.currentBpm.toFixed(0) + " | SpeedTrainer"

		// render everything else
		return (
			<div className="App">

				<Container className="app-container">
					<Row>
						<Col>
							{/* left pane with controls */}
							{this.renderLeftPane()}
						</Col>
						<Col>{this.renderRightPane()}</Col>
					</Row>
					<Row>
						<Col>
							{/* right pane with examples and plan*/}
							{this.renderBottomPane()}
						</Col>
					</Row>
				</Container>
			</div>
		);
	}

	onBeatsPerStepChange = () => {
		// plan doesn't change here, just the beats per step amount
		const newBps = this.getUiState().beatsPerStep;

		if (newBps !== this.refs.sm.beatsPerStep) {
			const accents = this.refs.barManager.getAccents();

			while (accents.length > newBps) {
				accents.pop();
			}
			while (accents.length < newBps) {
				accents.push(accentTypes.ACCENT_2);
			}

			this.refs.sm.setBeatsPerStep(newBps);
			this.refs.barManager.setAccents(accents);
			this.setState({ beatsPerStep: newBps });
		}
	};

	onPlanStep(step) {
		// console.log("<Apdiv>onPlanStep", step)
		// this.setBpm(step.bpm);

		if (step) {
			this.setState({ currentBpm: this.refs.sm.setStep(step) });
		}
	}


	setBpm = newBpm => {
		this.setState({ currentBpm: newBpm });
		this.refs.sm.setBpm(newBpm);
	};

	onInstrumentChange() {
		this.setState(prevState => ({
			instrumentDropdownOpen: !prevState.instrumentDropdownOpen
		}));

	}


	getUiState() {

		const s1 = {
			beatsPerStep: this.refs.beatsPerStep.getValue(),
			accents: this.refs.barManager.getAccents(),
			instrument: this.state.instrument
		};

		const s2 = this.refs.modePanel.getValue();
		// console.log('s2',s2.playbac)
		const uiState = { ...s1, ...s2 };

		// console.log("storing uiState", this.uiState);
		this.uiState = uiState;
		// HACK


		this.uiState.instrument = this.state.instrument;
		// console.log('uiState instrument',this.uiState.instrument)
		return uiState;
	}

	onAccentsChange() {
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
