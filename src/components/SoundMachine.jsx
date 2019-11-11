import React, { Component } from "react";
import Tone from "tone";
import { Badge, Collapse, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import { accentTypes } from "./AccentTypes";
import InstrumentLib from "./InstrumentLib";
import { InstrumentsArray } from "./Instruments"
import { PlaybackModes } from "./PlaybackModes";
import { PlayModes } from "./PlayModes";

import { Button } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
import Control from './Control'
import VisClock from './VisClock'

class SoundMachine extends Component {

	accentNotes = ["C3", "C#3", "D3"]; // this stay in sync with AccentTypes

	instrumentLib = undefined;

	// currentBeat = 0;
	// beatsPerStep = 4;

	progressRefreshRate = 1000 / 20; // 20 fps

	score = ["C3", "C#3", "C#3", "C#3"];

	state = {
		isPlaying: false,
		instrumentDropdownLabel: this.props.instrument.label,    // TODO: support old instrument without key/label
		instrument: this.props.instrument
	};

	accents = [accentTypes.ACCENT_1]; // default with accent on first beat


	transport = Tone.Transport;

	quantizationFactor = '1m'
	startStepCnt = 0;

	tone = Tone;
	constructor(props) {
		super(props);

		// init instruments library
		this.instrumentLib = new InstrumentLib();

	}

	onBufferError() {
		throw new Error("Some buffers weren't found")
	}

	onStop() {
		if (this.stepProgressUpdateTimer) {
			clearInterval(this.stepProgressUpdateTimer);
		}
	}

	onStart() {
		this.stepProgressUpdateTimer = setInterval(
			() => this.updateProgress(),
			this.progressRefreshRate
		);
	}

	componentDidMount() {
		// reload/debug bell
		var synth = new Tone.Synth().toMaster();
		synth.triggerAttackRelease("A2");

		Tone.Buffer.on("error", () => this.onBufferError());

		Tone.Transport.on('stop', () => this.onStop());
		Tone.Transport.on('start', () => this.onStart());
		// Tone.Transport.on('pause', () => console.log('TRANSPORT.pause'));
		// Tone.Transport.on('loop', (time) => this.props.onLoopEnd(time));

		Tone.context.latencyHint = "playback";

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

		this.setAccents2(InitPreset.accents);

		// shortcut to controls
		// this.control = this.refs.planner.refs.control

		this.refs.planner.setPlan(this.refs.control.getValue())
		// debugger
	}

	setAccents2(accents) {
		/*this.loop = new Tone.Part((time, note) => this.repeat(time, note), [[0, 'C3'], ["0:1", 'C#3'], ["0:2", 'C#'], ["0:3", 'C3']])
				this.loop.loop = true;
				this.loop.start(0);
		*/
		let idx = 0;
		let pattern = accents.map((item, idx) => {
			return [this.accentNotes[item]]
			// return ['0:' + idx, this.accentNotes[item]]
		})

		if (this.loop === undefined) {
			this.loop = new Tone.Sequence((time, note) => this.repeat(time, note), pattern)
			this.loop.loop = true;
			// this.loop.start(0);
			// console.log('clearing old loop')
			// debugger
			// this.loop.dispose();
			// this.loop.dispose();
			// this.loop = undefined;
		}

		// update existing part

		// for (let i = 0; i < pattern.length; i++) {
		// 	// const o = pattern[i];
		// 	// this.loop.remove(o[0])
		// 	this.loop.at(i, pattern[i])
		// }

		// check if we need to add new notes
		if (pattern.length > this.loop.length) {

			for (let i = this.loop.length; i < pattern.length; i++) {
				// const o = pattern[i];
				console.log('adding beat at', i, pattern[i])
				this.loop.add(i, pattern[i])
			}
			this.loop.loopEnd = '1m'
			this.loop.loopCount = 0;
			// this.loop.loopEnd = this.pattern.length;
			// this.loop.start()
		}
		else if (pattern.length === this.loop.length) {
			// update new accents
			for (let i = 0; i < pattern.length; i++) {
				this.loop.at(i, pattern[i])
			}
			
		}
		else if (pattern.length < this.loop.length) {
			while (this.loop.length > pattern.length) {
			this.loop.remove(this.loop.length-1)
		}
			
			// for (let i = pattern.length; i < this.loop.length; i++) {
			// 	//const o = pattern[i];
			// 	this.loop.remove(i)
			// }
			
		this.loop.loopEnd = '1m';
		this.loop.loopCount = 0;
			// this.loop.loopEnd =  '1m'
			// this.loop.loopEnd = this.pattern.length
			// this.loop.start()
		}


		console.log('loop updated, length: ', this.loop.length, this.loop.loopEnd)
		// check if we need to remove


		// pattern this.setBeatsPerStep(o .pattern)
		//
		// this.loop.at(o[0],o[1]) 


		// add loopCount to determine where are we at Tone.Part so we can highlight currently played beat
		
		// let newLoop = new Tone.Part((time, note) => function(time,note) {
		// 	console.log('newLoop event',time,note)
		// 	this.instrumentLib.getInstrument().triggerAttack(note, time);
		// 	// draw stuff
		// 	Tone.Draw.schedule(() => this.onBeat(idx), time)

		// 	// advance
		// 	this.currentBeat++;	
		// }, [[0, 'C3'], ["0:1", 'C#3'], ["0:2", 'C#'], ["0:3", 'C3']]);



		// newLoop.start(0);
		// newLoop.loop = true;
		// this.loop = newLoop;

		// this.loop = newLoop;
		// this.loop.start()
	}


	// onStepEvent = (time) => {
	// 	console.log('onStepEvent', time);
	// 	// TODO: rename onLoopEnd to onStepEnd
	// 	if (this.stepEvent.initialized && this.stepEvent.initialized === true) {
	// 		// console.log('onLoopEnd')

	// 		// console.log('onStepEvent','done, calling onLoopEnd')
	// 		// // this.startStepCnt--;
	// 		// // this.stepEvent.dispose();

	// 		this.stepEvent.cancel();
	// 		this.props.onStepEnd(time);
	// 		return;
	// 	}

	// 	if (!this.stepEvent.initialized) {
	// 		// console.log('onStepEvent','started')
	// 		this.stepEvent.initialized = true;
	// 	}
	// }



	// startStepEvent(interval) {
	// 	if (this.stepEvent) {
	// 		this.stepEvent.cancel();
	// 		this.stepEvent.dispose();
	// 		this.stepEvent = undefined
	// 	}

	// 	let stepEvent = new Tone.Loop(time => this.onStepEvent(time), interval);
	// 	this.stepEvent = stepEvent;
	// 	this.stepEvent.start();

	// 	console.log('scheduled event to execute after ', interval, 'seconds')
	// 	// Tone.Transport.schedule(time => this.props.onLoopEnd(time), interval)

	// }

	updateProgress() {

		// if (this.stepEvent && this.stepEvent.progress) {

		//this.props.onProgress(this.stepEvent.progress);
		// }
		// else {
		// 	this.props.onProgress(0)
		// }
		// if (this.vis) {
		// 	this.vis.drawFFT(this.instrumentLib.fft.getValue())
		// }


		// this.refs.planner.setProgress(this.stepEvent ? this.stepEvent.progress : 0)

		// this.refs.visClock.setProgress(this.loop.progress);

	}

	// setStep = (step) => {
	// 	this.currentStep = step
	// }
	// executeStep = (step) => {
	// 	// console.log('<SM>executeStep', this.currentStep, step)

	// 	if (!step) {
	// 		throw new Error("Invalid step " + step)
	// 	}
	// 	this.currentStep = step;

	// 	this.setBpm(step.bpm)

	// 	this.startStepEvent(step.duration);

	// }

	repeat = (time, note) => {
		// console.log('repeat', time, theNote)
		const idx = this.loop.loopCount++ % this.transport.timeSignature;

		// const note = this.score[idx];

		// make sound
		// console.log('repeat', time, this.currentBeat);

		this.instrumentLib.getInstrument().triggerAttack(note, time);

		// draw stuff

		Tone.Draw.schedule(() => this.onBeat(idx), time)

		// advance
		// this.currentBeat++;
	}

	setInstrument(instrument) {
		this.instrumentLib.setInstrument(instrument);
	}

	getCurrentInstrumentLabel() {
		return this.instrumentLib.getInstrument().label;
	}

	setBpm = bpm => {
		console.log("<SM>setBpm", bpm)

		if (isNaN(bpm) || bpm <= 0 || bpm > 1000) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {
			// Tone.Transport.bpm.value = bpm;
			this.transport.bpm.rampTo(bpm, 0.5);
			this.setState({ bpm: bpm })

		}
		// this.props.onBpmChange(bpm)
	};

	// setBeatsPerStep = newBps => {
	// 	if (isNaN(newBps)) {
	// 		throw new Error("Invalid value for bps: " + newBps)
	// 	}
	// 	// console.log("<SoundMachine>setBeatsPerStep", newBps)


	// 	this.beatsPerStep = newBps;

	// 	// remove if needed
	// 	while (this.score.length > newBps) {
	// 		this.score.pop();
	// 	}

	// 	// add if needed
	// 	while (this.score.length < newBps) {
	// 		this.score.push(accentTypes.ACCENT_1)
	// 	}

	// 	// set new value
	// 	Tone.Transport.timeSignature = newBps;//[newBps, 4];
	// 	// Tone.Transport.loop = true;


	// 	// this will refresh visualisation
	// 	this.setState({ beatsPerStep: newBps })

	// 	// this.setState({ beatsPerStep: newBps }, this.executeStep(this.currentStep))
	// };

	onBeat = (currentBeat) => {
		this.refs.control.setActiveBeat(currentBeat);

		// this.fft.connect(Tone.Master);

		// console.log('beat', this.fft.getValue())
	}

	// setAccents(accentTypesArr) {
	// 	// this.accents = accentTypesArr;

	// 	for (let i = 0; i < this.score.length; i++) {
	// 		// by default 2 will be the tick note
	// 		let note = this.accentNotes[accentTypes.ACCENT_2];

	// 		// if accent for this step is specified set it here
	// 		if (
	// 			accentTypesArr[i] !== undefined &&
	// 			accentTypesArr[i] === accentTypes.ACCENT_1
	// 		) {
	// 			note = this.accentNotes[accentTypes.ACCENT_1];
	// 		} else if (
	// 			accentTypesArr[i] !== undefined &&
	// 			accentTypesArr[i] === accentTypes.ACCENT_3
	// 		) {
	// 			note = this.accentNotes[accentTypes.ACCENT_3];
	// 		}
	// 		this.score[i] = note;
	// 	}
	// }

	toggle = () => {
		//console.log("<SM>HandleStartStop, state:", Tone.Transport.state)

		if (Tone.Transport.state === 'started') {
			this.stop();

		} else {
			// this.setStep(this.currentStep);
			this.start();
			// // this.start(this.currentStep);
		}
	};

	onPlanStep(step) {
		if (!step) {
			// console.log('undefined step so stopping')
			this.stop();
			return;
			// throw new Error("Invalid step: " + step);
		}
		console.log("<SM>Setting step: bpm:", step.bpm, "duration", step.duration)

		this.currentStep = step;


		this.setBpm(this.currentStep.bpm)
		// this.setBeatsPerStep()

		// if (this.transport.timeSignature != this.currentStep.accents.length) {
		this.transport.timeSignature = step.accents.length;
		// }

		this.setAccents2(this.currentStep.accents)

		if (Tone.Transport.state === 'started') {
			this.refs.planner.startStepEvent(this.currentStep.duration);
		}
		// this.setState({ beatsPerStep: this.currentStep.accents.length })

		//
		//this.executeStep(step);
	}

	onControlChange(value) {
		this.refs.planner.setPlan(value);
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
		//

		this.setInstrument(instrument);
		// this.props.onInstrumentChange(instrument)
		// this.props.sm.setInstrument(instrument)
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

			<SimplePanel title="Control">
				<Row>
					<Col>
						<Button
							outline
							color="light"
							onClick={() => this.toggle()}
							block
							active={this.state.isPlaying}
						>
							Start / Stop
						</Button>
					</Col>
				</Row>

				<Row>
					<Col>
						<Container>
							<Row>
								<Col>
									<Col xs="3">Instrument</Col>
								</Col>
								<Col>
									{this.renderInstrumentsDropDown()}
								</Col>
							</Row>
						</Container>

					</Col>
				</Row>
				<Row>
					<VisClock ref="visClock" />

				</Row>

				<Row><Col><h2><Badge color="dark">BPM: {this.state.bpm}</Badge></h2></Col></Row>
				{/* <Row>POS: {this.transport.position}</Row>	 */}
				<Row>
					<Col>

						<SimplePanel title={"Plan"}>
							<Planner
								transport={this.transport}
								cookies={this.props.cookies}
								// currentBpm={this.refs.sm.transport.bpm.value}
								// onChange={() => this.onPlanChanged()}
								onStep={step => this.onPlanStep(step)}
								ref="planner"
							/>
							<Control ref='control' cookies={this.props.cookies} onChange={(value) => this.onControlChange(value)} />

						</SimplePanel>
					</Col>
				</Row>
			</SimplePanel>
			// <div style={{width: '100%'}}>
			// 	{/* <div>Sound is {this.state.isPlaying === true ? "playing" : "stopped"}</div> */}
			// 	{/* <SimpleVis ref="vis" beats={this.state.beatsPerStep}/> */}
			// </div>
		);
	}

	// setVis(vis) {
	// 	this.vis = vis;
	// }

	stop() {


		this.transport.stop();
		this.loop.stop();
		this.loop.loopCount = 0;

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
		console.log('<SM>Start')

		// this.currentBeat = 0;

		if (!this.currentStep) {
			throw new Error("<SM>currentStep is invalid")
		}

		this.setBpm(this.currentStep.bpm);
		this.transport.timeSignature = this.currentStep.accents.length;
		// this.setState({ isPlaying: true });
		// this.transport.position = 0;
		// this.loop.position = 0;
		// this.transport.position = 0;
		this.loop.start(0);
		this.transport.start();
		this.refs.planner.startStepEvent(this.currentStep.duration);
		this.setState({ isPlaying: true });

	}

}

export default SoundMachine;


SoundMachine.defaultProps = {
	// beatsPerStep: 4,
	onBpmChange: function (bpm) { },
	onStepEnd: function () { },
	// onLoopEnd: function (time) { },
	// onToggle: function (state) { },
	onProgress: function (progress) { },
	instrument: InitPreset.instrument
};