import React, { Component } from "react";
import Tone from "tone";
import { Badge, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import InstrumentLib from "./InstrumentLib";
import { InstrumentsArray } from "./Instruments"
import { Button } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
import Tr from './Locale'
import PresetsManager from './PresetsManager'
import SvgClock from "./SvgClock";
import { AccentNotes } from './AccentTypes'
import ModePanel from './ModePanel'
import TrackView from './TrackView/TrackView'
import KeyboardEventHandler from 'react-keyboard-event-handler'

class SoundMachine extends Component {

	progressFps = 30; // TODO: Set this according to device. higher values might cause slower devices to stutter

	instrumentLib = new InstrumentLib({
		onInstrumentReady: (smi) => this.onInstrumentReady(smi)
	});

	state = {
		initialized: false,
		config: InitPreset,
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

		Tone.Transport.lookAhead = 10;

		this.loop = new Tone.Part((time, note) => this.repeat(time, note), [])
		this.loop.loop = true;
		this.loop.start(0)



		const config = this.getConfig();

		this.setPlan(config);

		this.initProgressUpdate();
		this.documentTitle = document.title;
	}

	getConfig() {
		return { ...this.refs.modePanel.state, ...{ track: this.state.track }, ...{ instrumentKey: this.state.instrument ? this.state.instrument.key : InitPreset.instrumentKey } };
	}


	initProgressUpdate() {
		setInterval(() => this.onProgress(), 1000 / this.progressFps)
	}

	setPlan(config) {
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
			return;
		}

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

			return o;
		})

		this.loop.removeAll();

		// add new notes if requires
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
		for (let i = 0; i < notes.length; i++) {
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
		}
	}

	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1200) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {
			Tone.Transport.bpm.value = bpm;
			this.setState({ bpm: bpm })
			document.title = bpm.toFixed(0) + ' | ' + this.documentTitle
		}
	};

	toggle() {
		Tone.Transport.state === 'started' ? this.stop() : this.start();
	};

	onPlanStep(bpm) {
		this.setBpm(bpm);
	}

	onControlChange() {
		const v = this.getConfig();
		this.setPlan(v);
	}

	onInstrumentChange() {
		this.setState(prevState => ({
			instrumentDropdownOpen: !prevState.instrumentDropdownOpen
		}));
	}

	onInstrumentSelect(instrumentKey) {
		let mustRecreate = false;
		if (this.instrumentLib.hasInstrument(instrumentKey)) {
			// instrument is already in library so use  it
			const samplesUsedCnt = this.state.instrument ? this.state.instrument.samples.length : 0;
			const instrument = this.instrumentLib.getInstrument(instrumentKey);

			let newTrack = [];
			// Update track as new instrument might have less samples than previous
			if (samplesUsedCnt > instrument.samples.length) {


				this.state.track.forEach(element => {
					let col = []
					element.forEach((subEl, idx) => {
						if (subEl < instrument.samples.length) {
							col.push(subEl)
						}

					});
					newTrack.push(col)
				});
				mustRecreate = true;
			}
			else {
				newTrack = this.state.track
			}


			this.setState({
				instrument: instrument,
				instrumentDropdownLabel: instrument.label
			}, mustRecreate ? () => this.setTrack(newTrack) : null);
			// }, () => this.setTrack(newTrack));
		}
		else {
			this.instrumentLib.loadInstrument(instrumentKey)
		}
	}

	onPresetSelect(preset) {
		this.setState({ track: preset.track }, function () {
			this.refs.modePanel.setValue(preset)

			this.onInstrumentSelect(preset.instrumentKey);

		});
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
		if (this.state.track.length !== newTrack.length) {
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
											// outline
											block
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
								onChange={() => this.onControlChange()}
							/>
						</Col>
						<Col style={{margin: 'auto'}}>
							<SvgClock ref="svgClock" instrument={this.state.instrument} track={this.state.track} />
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
					
					</Row>

				</Container >
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