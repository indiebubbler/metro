import React, { Component } from "react";
import Tone from "tone";
import { Badge, Collapse, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import InstrumentLib from "./InstrumentLib";
import { InstrumentsArray } from "./Instruments"
import { Button } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
// import Control from './Control'
import Tr from './Locale'
import PresetsManager from './PresetsManager'
import SvgClock from "./SvgClock";

import ModePanel from './ModePanel'
import PlaybackPanel from './PlaybackPanel'
import TrackView from './TrackView/TrackView'

class SoundMachine extends Component {

	accentNotes = ["C3", "C#3", "D3"]; // this stay in sync with AccentTypes

	progressFps = 30; // higher values might cause slower devices to stutter

	instrumentLib = new InstrumentLib();
	state = {
		isPlaying: false,
		instrumentDropdownLabel: this.props.instrument.label,    // TODO: support old instrument without key/label
		instrument: this.props.instrument,
		track: this.props.track
		// accents: this.props.accents
	};

	transport = Tone.Transport;


	tone = Tone;

	onBufferError() {
		throw new Error("Some buffers weren't found")
	}

	componentDidMount() {
		// reload/debug bell
		var synth = new Tone.Synth().toMaster();
		synth.triggerAttackRelease("A2");

		Tone.Buffer.on("error", () => this.onBufferError());

		// Tone.Transport.on('stop', () => this.onStop());
		// Tone.Transport.on('start', () => this.onStart());
		// Tone.Transport.on('pause', () => console.log('TRANSPORT.pause'));
		// Tone.Transport.on('loop', (time) => this.props.onLoopEnd(time));

		//		Tone.context.latencyHint = "playback";
		Tone.Transport.lookAhead = 10;

		// console.log('init preset accents length', InitPreset.accents.length)
		// Tone.Transport.timeSignature = InitPreset.accents.length;

		// this.setBeatsPerStep(InitPreset.accents.length)
		// Tone.Transport.loop = false;
		// Tone.Transport.loopEnd = "1m"
		// this.transport.loopStart = 0;
		//  hmm this will make stepEvent useless as it will reset on every measure
		// this.transport.loopEnd = "100m";
		// this.transport.loop = true;

		// this.loop = new Tone.Loop((time) => this.repeat(time), "4n");

		// this.setAccents2(InitPreset.accents);

		// shortcut to controls
		// this.control = this.refs.planner.refs.control

		// initialize machine
		const config = this.getConfig();
		this.setPlan(config);

		this.initProgressUpdate()
	}

	getConfig() {
		// collect UI information form panels and return all settings
		return { ...this.refs.modePanel.state, ...this.refs.trackView.state };
	}

	setConfig(value) {
		this.refs.modePanel.setValue(value)
		this.refs.trackView.setValue(value);
		this.onControlChange()
	}

	initProgressUpdate() {
		// console.log('<SM>	initProgressUpdate')
		setInterval(() => this.onProgress(), 1000 / this.progressFps)
	}

	setPlan(config) {
		// cancel all events
		this.transport.cancel();
		this.transport.position = 0;

		// slice will force to recreate loop as it was cancelled just moment ago
		this.setTrack(config.track.slice());
		// this.setAccents(config.accents.slice());

		// const currentStep  = this.refs.planner.getCurrentStep() 
		// set new plan but try to set same step
		this.refs.planner.setPlan(config);

	}

	setTrack(track) {
		if (this.lastTrack === track) {
			// console.log('accents unchanged')
			return;
		}

		this.lastTrack = track

		this.setTimeSignature(track.length);

		// translate from enum into notes
		let pattern = track.map((item, idx) => {
			let o;

			if (Array.isArray(item)) {

				o = item.map(subItem => {
					return [this.accentNotes[subItem]]
				});
			}
			else {
				o = [this.accentNotes[item]]
			}
			return o
		})
		if (this.loop === undefined) {
			console.log('<SM>New main loop defined')
			// this.loop = new Tone.Sequence((time, note) => this.repeat(time, note), [], '4n')
			this.loop = new Tone.Part((time, note) => this.repeat(time, note), [])
			this.loop.loop = true;
			this.loop.start(0)
		}

		this.loop.removeAll();

		// update existing notes
		// for (let i = 0; i < Math.min(this.loop.length, pattern.length); i++) {
		// 	//console.log('updating loop,', i, pattern[i]);
		// 	this.loop.at(i, pattern[i])
		// }

		// add new notes if requires
		let t = 0;
		if (pattern.length > this.loop.length) {
			for (let i = this.loop.length; i < pattern.length; i++) {
				console.log('adding beat at', "0:" + i, pattern[i])
				this.loop.add("0:" + i, pattern[i]);
			}
		}

		else if (pattern.length < this.loop.length) {
			const cnt = this.loop.length - pattern.length
			// console.log('elements to delete', cnt)

			for (let i = 0; i < cnt; i++) {
				let idx = pattern.length + i;
				// let el = this.loop.at(i);
				console.log('removing', idx)
				this.loop.remove("0:" + idx)
			}
		}

		this.loop.loopEnd = '1m'
		this.loop.start(0);


		// this.setState({ accents: accents })
		this.setState({ track: track })
		// console.log('<SM>Accents changed')

		// if (this.refs.cssClock) { 
		// 	this.refs.cssClock.setAccents(accents)
		// }
	}

	onProgress() {
		if (this.transport.state === 'stopped') {
			return;
		}
		if (this.refs.debug) {
			this.refs.debug.innerHTML = this.transport.seconds.toFixed(1)
		}
		this.refs.planner.updateProgress()
		this.refs.svgClock.setProgress(this.loop.progress)
	}

	repeat = (time, notes) => {
		// make sound
		// console.log('playing notes', notes)
		for (let i = 0 ; i < notes.length ; i++) {
			this.instrumentLib.getInstrument().triggerAttack(notes[i], time);
		}
		// draw stuff
		this.refs.trackView.setActiveColumn(Math.floor(this.loop.progress * this.transport.timeSignature));
	}

	calcTimeForBpm(seconds, bpm) {
		return Tone.Time(seconds * bpm / this.baseBpm);
	}

	setInstrument(instrument) {
		this.instrumentLib.setInstrument(instrument);
	}

	getCurrentInstrumentLabel() {
		return this.instrumentLib.getInstrument().label;
	}

	setTimeSignature(timeSignature) {
		if (timeSignature !== this.transport.timeSignature) {
			this.transport.timeSignature = timeSignature;
			console.log("<SM>Setting new time signature", this.transport.timeSignature)
		}
	}

	// onProgressEvent(time) {
	// 	Tone.Draw.schedule(() => this.onProgress(), time)
	// }

	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1000) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {

			Tone.Transport.bpm.value = bpm;
			this.setState({ bpm: bpm })
		}
	};

	toggle() {
		Tone.Transport.state === 'started' ? this.stop() : this.start();
	};

	getTimelineEvent(eventId) {
		return this.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	}

	onPlanStep(bpm) {
		// console.log('<SM>onPlanStep', bpm);
		this.setBpm(bpm);
	}

	onControlChange() {
		// const currentStepIdx = this.refs.planner.getCurrentStep().stepIdx;
		const v = this.getConfig();
		this.setPlan(v);

	}

	onInstrumentChange() {
		this.setState(prevState => ({
			instrumentDropdownOpen: !prevState.instrumentDropdownOpen
		}));

	}

	onInstrumentSelect(instrument) {
		this.setState({
			instrument: instrument,
			instrumentDropdownLabel: instrument.label
		});
		this.setInstrument(instrument);
	}

	onPresetSelect(preset) {
		this.refs.control.setValue(preset)
		this.onInstrumentSelect(preset.instrument)
		// this.refs.playbackPanel.setValue(preset);
		// this.props.onPresetSelect(preset)
	}


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
				{InstrumentsArray.map((item) =>
					<DropdownItem key={item.key} onClick={() => this.onInstrumentSelect(item)}>
						{item.label}
					</DropdownItem>
				)}
			</DropdownMenu>
		</ButtonDropdown>);

	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<SimplePanel title={Tr('Control')}>
							<Row>
								<Col>
									<div ref='debug'>debug</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<Button
										color="light"
										onClick={() => this.toggle()}
										block
										active={this.state.isPlaying}
									>
										{Tr("Start / Stop")}
									</Button>
								</Col>
							</Row>
							<Row>
								<Col>
									<Container>
										<Row>
											<Col>
												<Col xs="3">{Tr("Instrument")}</Col>
											</Col>
											<Col>
												{this.renderInstrumentsDropDown()}
											</Col>
										</Row>
									</Container>
								</Col>
							</Row>

							<Row><Col><h2><Badge color="dark">BPM: {this.state.bpm}</Badge></h2></Col>
							</Row>
							<Row>

							</Row>
						</SimplePanel>
					</Col>
					{/* <Control ref='control' cookies={this.props.cookies} onPresetSelect={(preset) => this.onInstrumentSelect(preset.instrument)} onChange={() => this.onControlChange()} /> */}
					<Col>
						<ModePanel
							ref="modePanel"
							onChange={() => this.onControlChange()}
						/>
					</Col>
				</Row>
				
				<Row>

					<Col>
						<TrackView ref='trackView' onChange={() => this.onControlChange()} />
						{/* <PlaybackPanel ref='playbackPanel' onChange={() => this.onControlChange()} /> */}
					</Col>
				</Row>

				<Col>
					<Row>
						<Col>

							<Planner
								transport={this.transport}
								//					cookies={this.props.cookies}
								// currentBpm={this.refs.sm.transport.bpm.value}
								progress={this.state.progress}
								onChange={() => this.onControlChange()}
								onPlanStep={(bpm) => this.onPlanStep(bpm)}
								onPlanEnd={() => this.stop()}
								ref="planner"
							/>
						</Col>
						<Col>
							<SvgClock ref="svgClock" track={this.state.track}/>
						</Col>
					</Row>
				</Col>
				<Col>
					<PresetsManager
						ref="presetsManager"
						cookies={this.props.cookies}
						// presets={PresetsLib}
						getPreset={() => this.getUiState()}
						onSelect={preset => this.onPresetSelect(preset)}
					/>
				</Col>
			</Container >
		);
	}

	stop() {

		this.transport.stop();
		this.transport.position = 0;
		// this.loop.stop();


		// this.part.start();
		// if (this.stepEvent) {
		// 	this.stepEvent.stop();
		// }
		// this.transport.position = 0;
		// console.log('stopped')
		// console.log('<SM>stop')
		this.setState({ isPlaying: false });
		// this.stepEvent.stop();

	}

	start() {

		this.transport.start("+.1");
		this.loop.start();
		this.setState({ isPlaying: true });
	}
	// start_old() {
	// 	console.log('<SM>Start')

	// 	// this.currentBeat = 0;

	// 	if (!this.currentStep) {
	// 		throw new Error("<SM>currentStep is invalid")
	// 	}

	// 	// this.setBpm(this.currentStep.bpm);
	// 	// this.setTimeSignature(this.currentStep.accents.length)
	// 	// this.setState({ isPlaying: true });
	// 	this.executeStep(this.currentStep)
	// 	// this.transport.position = 0;
	// 	// this.loop.position = 0;
	// 	// this.transport.position = 0;
	// 	// this.loop.start(0);
	// 	this.transport.start();
	// 	// this.loop.position = 0;
	// 	// this.refs.planner.startStepEvent(this.currentStep.duration);
	// 	this.setState({ isPlaying: true });

	// }

}

export default SoundMachine;


SoundMachine.defaultProps = {
	// beatsPerStep: 4,
	onBpmChange: function (bpm) { },
	onStepEnd: function () { },
	// onLoopEnd: function (time) { },
	// onToggle: function (state) { },
	// onProgress: function (progress) { },
	instrument: InitPreset.instrument
	
	// accents: InitPreset.accents
};