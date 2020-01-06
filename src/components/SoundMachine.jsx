import React, { Component } from "react";
import Tone from "tone";
import { Badge, Collapse, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import InstrumentLib from "./InstrumentLib";
import { InstrumentsArray, Instruments } from "./Instruments"
import { Button, Spinner } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
// import Control from './Control'
import Tr from './Locale'
import PresetsManager from './PresetsManager'
import SvgClock from "./SvgClock";
import { AccentNotes } from './AccentTypes'
import ModePanel from './ModePanel'
import PlaybackPanel from './PlaybackPanel'
import TrackView from './TrackView/TrackView'
import SoundMachineInstrument from './SoundMachineInstrument'
import KeyboardEventHandler from 'react-keyboard-event-handler'

class SoundMachine extends Component {


	// accentNotes = ["C3", "C#3", "D3"]; // this stay in sync with AccentTypes

	progressFps = 30; // TODO: Set this according to device. higher values might cause slower devices to stutter

	instrumentLib = new InstrumentLib({
		onInstrumentReady: (smi) => this.onInstrumentReady(smi)
	});

	state = {
		initialized: false,
		// isPlaying: false,
		// initialized: false,
		config: InitPreset,
		// instrumentDropdownLabel: this.instrumentLib.getInstrument().label,    // TODO: support old instrument without key/label
		// instrument: this.instrumentLib.getInstrument(),
		track: this.props.track
	};

	transport = Tone.Transport;

	tone = Tone;

	onBufferError(e) {
		throw new Error(e);
	}

	onInstrumentReady(smi) {

		this.onInstrumentSelect(smi.key)

		if (this.state.initialized === false) {
			this.setState({ initialized: true })
			this.props.onReady();
		}
	}

	componentDidMount() {
		// reload/debug bell
		var synth = new Tone.Synth().toMaster();
		synth.triggerAttackRelease("A2");

		Tone.Buffer.on("error", this.onBufferError);

		// Tone.Transport.on('stop', () => this.onStop());
		// Tone.Transport.on('start', () => this.onStart());
		// Tone.Transport.on('pause', () => console.log('TRANSPORT.pause'));
		// Tone.Transport.on('loop', (time) => this.props.onLoopEnd(time));

		//		Tone.context.latencyHint = "playback";
		Tone.Transport.lookAhead = 10;

		// initialize machine
		// console.log('<SM>New main loop defined')

		this.loop = new Tone.Part((time, note) => this.repeat(time, note), [])
		this.loop.loop = true;
		this.loop.start(0)



		const config = this.getConfig();

		this.setPlan(config);

		this.initProgressUpdate();
		this.documentTitle = document.title;
	}

	getConfig() {
		// if (this.state.initialized === false) {
		// 	debugger
		// }
		// collect UI information form panels and return all settings
		// instrument might be not loaded yet so have a check here. Bit dodgy but should do
		return { ...this.refs.modePanel.state, ...{ track: this.state.track }, ...{ instrumentKey: this.state.instrument ? this.state.instrument.key : InitPreset.instrumentKey } };
	}


	initProgressUpdate() {
		console.log('<SM>	initProgressUpdate')
		setInterval(() => this.onProgress(), 1000 / this.progressFps)
	}

	setPlan(config) {
		console.log('setPlan', config)
		// cancel all events
		this.transport.cancel();
		this.transport.position = 0;
		// debugger
		this.setTrack(config.track.slice());	// TODO: Unsure why we need to pass copy
		this.refs.planner.setPlan(config);

	}

	setTrack(track, force = false) {
		// debugger
		if ((force === false && this.state.track === track)) {
			console.log('track unchanged')
			return;
		}
		console.log('recreating track', track)

		// this.setState({ accents: accents })

		// this.lastTrack = track
		// if (isLengthChanged) {
		// 	// if we changed length we need to update plan
		// 	this.setPlan(config)

		// }
		this.setTimeSignature(track.length);

		// map track encoded as digits into notes
		let pattern = track.map((item) => {
			let o;

			if (!Array.isArray(item)) {
				throw new Error("Invalid track item");
			}

			o = item.map((subItem) => {
				return [AccentNotes[subItem]]
			});

			return o
		})
		// console.log('pattern', pattern)

		this.loop.removeAll();

		// update existing notes
		// for (let i = 0; i < Math.min(this.loop.length, pattern.length); i++) {
		// 	debugger
		// 	console.log('updating loop b,', "0:", pattern[i]);
		// 	this.loop.at("0:" + i, pattern[i])
		// 	console.log('loop a', "0:", pattern[i]);
		// }

		// add new notes if requires
		let t = 0;
		if (pattern.length > this.loop.length) {
			for (let i = this.loop.length; i < pattern.length; i++) {
				// console.log('adding beat at', "0:" + i, pattern[i])
				this.loop.add("0:" + i, pattern[i]);

			}
		}

		else if (pattern.length < this.loop.length) {
			const cnt = this.loop.length - pattern.length
			// console.log('elements to delete', cnt)

			for (let i = 0; i < cnt; i++) {
				let idx = pattern.length + i;
				// console.log('removing', idx)
				this.loop.remove("0:" + idx)
			}
		}

		this.loop.loopEnd = '1m'
		this.loop.start(0);

		this.setState({ track: track })

	}

	recalculatePlan() {
		const config = this.getConfig()
		console.log('recalculatePlan', config)
		this.setPlan(this.getConfig())
	}


	onProgress() {
		if (this.transport.state === 'stopped') {
			return;
		}
		if (this.refs.debug) {
			this.refs.debug.innerHTML = this.transport.seconds.toFixed(1)
		}

		if (this.refs.planner) { this.refs.planner.updateProgress() }


		if (this.refs.svgClock) { this.refs.svgClock.setProgress(this.loop.progress) }
	}

	repeat = (time, notes) => {
		// make sound
		// console.log('playing notes', notes)
		// console.log('repeat', this.state.instrument.key)
		for (let i = 0; i < notes.length; i++) {
			// console.log('playing', i, notes[i])
			this.state.instrument.triggerAttack(notes[i], time);
		}
		// display current beat on TrackView
		this.refs.trackView.setActiveColumn(Math.floor(this.loop.progress * this.transport.timeSignature));
	}

	calcTimeForBpm(seconds, bpm) {
		return Tone.Time(seconds * bpm / this.baseBpm);
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

	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1200) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {
			Tone.Transport.bpm.value = bpm;
			this.setState({ bpm: bpm })
			document.title = bpm + ' | ' + this.documentTitle
		}
	};

	toggle() {
		Tone.Transport.state === 'started' ? this.stop() : this.start();
	};

	// getTimelineEvent(eventId) {
	// 	return this.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	// }

	onPlanStep(bpm) {
		// console.log('<SM>onPlanStep', bpm);
		this.setBpm(bpm);
	}

	onControlChange() {
		// const currentStepIdx = this.refs.planner.getCurrentStep().stepIdx;

		const v = this.getConfig();
		console.log('onControlChange', v.track, this.state.track)
		// this.setTrack(v.track)
		// console.log('onControlChange', v.track)
		this.setPlan(v);

	}

	onInstrumentChange() {
		this.setState(prevState => ({
			instrumentDropdownOpen: !prevState.instrumentDropdownOpen
		}));

	}


	onInstrumentSelect(instrumentKey) {
		// if (this.instrumentLib.hasInstrument(instrumentKey)) {

		if (this.instrumentLib.hasInstrument(instrumentKey)) {
			// instrument is already in library so use  it
			console.log('instrument is in library already')
			const samplesUsedCnt = this.state.instrument ? this.state.instrument.samples.length : 0;
			const instrument = this.instrumentLib.getInstrument(instrumentKey);
			// const instrument = this.instrumentLib.setInstrument(instrumentKey);
			// console.log('setting instrument', instrument.label)

			let newTrack = [];
			// Update track as new instrument might have less samples than previous
			if (samplesUsedCnt > instrument.samples.length) {
				console.log('here we go, less samples => recreate')
				this.state.track.forEach(element => {
					let col = []
					element.forEach((subEl, idx) => {
						if (subEl < instrument.samples.length) {
							col.push(subEl)
						}
					});
					newTrack.push(col)
				});
			}
			else {
				console.log('more samples, so no problemo')
				newTrack = this.state.track
			}

			// console.log('')

			this.setState({
				instrument: instrument,
				instrumentDropdownLabel: instrument.label
			});
			// }, () => this.setTrack(newTrack));
		}
		else {
			this.instrumentLib.loadInstrument(instrumentKey)
		}
	}

	onPresetSelect(preset) {
		console.log("<SM>onPresetSelect")


		// setConfig(value) {

		// this.setPlan(preset);

		this.onInstrumentSelect(preset.instrumentKey);
		// this.setTrack(preset.track)
		// this.setState({track: preset.track})
		// this.setTrack(preset.track)
		// this.state.track = preset.track

		this.setState({ track: preset.track });///this.state.track = preset.track;

		this.refs.modePanel.setValue(preset)


		// this.setState({ track: preset.track })
		// this.refs.modePanel.setValue(preset);



		// this.refs.trackView.setValue(value.track);
		// this.onControlChange()
		// }

		// debugger
		// this.setTrack(preset.track)
		// this.refs.trackView.setValue(preset.track)
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
					<DropdownItem key={item.key} onClick={() => this.onInstrumentSelect(item.key)}>
						{item.label}
					</DropdownItem>
				)}
			</DropdownMenu>
		</ButtonDropdown>);

	}

	onTrackChange(newTrack, isLengthChanged = false) {
		console.log('onTrackChange')
		// const config = this.getConfig()

		if (this.state.track.length != newTrack.length) {
			// length changed so after setting track, recreate Plan
			const config = this.getConfig();
			config.track = newTrack
			this.setPlan(config);
		}
		else {
			this.setTrack(newTrack)
		}

	}

	handleKey(key, e) {
		switch (key) {
			case 's':
				this.toggle();
				break;
			case 'esc':
				this.stop();
				break;
			case 'left':
				this.refs.planner.stepBackward()
				break;
			case 'right':
				this.refs.planner.stepForward()
				break;
			case 'up':
				if (this.state.bpm < 600) {
					this.setBpm(this.state.bpm + 10);
				}
				break;
			case 'down':
				if (this.state.bpm > 10) {
					this.setBpm(this.state.bpm - 10);
				}
				break;
			default:
				break;
		}
	}
	render() {
		return (

			<>
				<KeyboardEventHandler handleKeys={['s', 'esc', 'left', 'right', 'up', 'down']} onKeyEvent={(key, e) => this.handleKey(key, e)} />
				<Container>

					<Row>
						<Col>
							<SimplePanel title={Tr('Control')}>
								<Row>
									<Col>
										<Button
											// color="primary"
											onClick={() => this.toggle()}
											color={this.state.isPlaying ? 'secondary' : 'light'}
											outline
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

								<Row><Col><h2><Badge color="dark">BPM: {Tone.Transport.bpm.value.toFixed(0)}</Badge></h2></Col>
								</Row>
								<Row>

								</Row>
							</SimplePanel>
						</Col>
						<Col>
							<ModePanel
								ref="modePanel"
								//bpmRange={this.state.bpmRange}
								//config={this.state.config}
								onChange={() => this.onControlChange()}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<TrackView
								ref='trackView'
								track={this.state.track}
								instrument={this.state.instrument}
								onChange={(track, isLengthChanged) => this.onTrackChange(track, isLengthChanged)}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Planner
								transport={this.transport}
								progress={this.state.progress}
								onChange={() => this.onControlChange()}
								onPlanStep={(bpm) => this.onPlanStep(bpm)}
								onPlanEnd={() => this.stop()}
								ref="planner"
							/>
						</Col>
						<Col>
							<PresetsManager
								ref="presetsManager"
								getPreset={() => this.getConfig()}
								onSelect={preset => this.onPresetSelect(preset)}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<SvgClock ref="svgClock" instrument={this.state.instrument} track={this.state.track} />
						</Col>
					</Row>

				</Container >
			</>
			// </KeyboardEventHandler>
		);
	}

	stop() {

		this.transport.stop();
		this.transport.position = 0;
		this.setState({ isPlaying: false });
	}

	start() {
		this.transport.start("+.1");
		this.loop.start();
		this.setState({ isPlaying: true });
	}
}

export default SoundMachine;


SoundMachine.defaultProps = {
	instrument: InitPreset.instrument,
	track: InitPreset.track,
	onReady: function () { }
};