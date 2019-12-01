import React, { Component } from "react";
import Tone from "tone";
import { Badge, Collapse, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import InstrumentLib from "./InstrumentLib";
import { InstrumentsArray } from "./Instruments"
import { Button } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
import Control from './Control'
import VisClock from './VisClock'
import Tr from './Locale'
import CssClock from "./CssClock";
class SoundMachine extends Component {

	accentNotes = ["C3", "C#3", "D3"]; // this stay in sync with AccentTypes

	progressFps = 15; // higher values might cause slower devices to stutter

	instrumentLib = new InstrumentLib();
	state = {
		isPlaying: false,
		instrumentDropdownLabel: this.props.instrument.label,    // TODO: support old instrument without key/label
		instrument: this.props.instrument,
		accents: this.props.accents,
		loopProgress: 0
	};

	transport = Tone.Transport;

	startStepCnt = 0;

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
		const config = this.refs.control.getValue();

		this.setPlan(config);

	}

	initProgressUpdate(fps) {

		if (this.progressEventId) {
			this.transport.clear(this.progressEventId)
		}
		console.log('init Progress with fps:', fps)
		this.progressEventId = this.transport.scheduleRepeat((time) => this.onProgressEvent(time), 1 / fps)

	}

	setPlan(config) {
		this.transport.cancel();
		this.transport.position = 0;
		this.initProgressUpdate(this.progressFps)

		// slice will force to recreate loop as it was cancelled just moment ago
		this.setAccents(config.accents.slice());

		// progress

		this.refs.planner.setPlan(config);
	}

	setAccents(accents) {
		if (this.lastAccents === accents) {
			// console.log('accents unchanged')
			return;
		}

		this.lastAccents = accents

		this.setTimeSignature(accents.length);

		let pattern = accents.map((item, idx) => {
			return [this.accentNotes[item]]
		})

		if (this.loop === undefined) {
			console.log('<SM>New main loop defined')
			this.loop = new Tone.Sequence((time, note) => this.repeat(time, note), [], '4n')
			this.loop.loop = true;
			this.loop.start(0)
		}
		// debugger
		// update existing notes
		for (let i = 0; i < Math.min(this.loop.length, pattern.length); i++) {
			//console.log('updating loop,', i, pattern[i]);
			this.loop.at(i, pattern[i])
		}

		// add new notes if requires
		if (pattern.length > this.loop.length) {
			for (let i = this.loop.length; i < pattern.length; i++) {
				// console.log('adding beat at', i, pattern[i])
				this.loop.add(i, pattern[i]);
			}
		}

		else if (pattern.length < this.loop.length) {
			const cnt = this.loop.length - pattern.length
			// console.log('elements to delete', cnt)

			for (let i = 0; i < cnt; i++) {
				let idx = pattern.length + i;
				let el = this.loop.at(i);
				// console.log('removing', el)
				this.loop.remove(idx)
			}
		}

		this.loop.loopEnd = '1m'
		this.loop.start(0)

		this.setState({accents: accents})
		// console.log('<SM>Accents changed')

		// if (this.refs.cssClock) { 
		// 	this.refs.cssClock.setAccents(accents)
		// }
	}

	onProgress(time) {
		this.refs.debug.innerHTML = this.transport.seconds.toFixed(1)
		this.refs.planner.updateProgress()

		this.refs.cssClock.setProgress(this.loop.progress)
		// this.setState({loopProgress : this.loop.progress})
		// this.refs.cssClock.setProgress(this.loop.progress, this.lastAccents)
		// this.setState({progress: this.loop.progress})
		// if (this.vis) {
		// 	this.vis.drawFFT(this.instrumentLib.fft.getValue())
		// }
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
		// console.log(this.loop.loopCount)
		// const note = this.score[idx];

		// make sound
		// console.log('repeat', time, this.currentBeat);

		this.instrumentLib.getInstrument().triggerAttack(note, time);
		// draw stuff

		// Tone.Draw.schedule(() => this.onBeat(idx), time)
		// Tone.Draw.schedule(() => this.onProgress(this.loop.progress), time)

		// advance
		// this.currentBeat++;
	}

	calcTimeForBpm(seconds, bpm) {
		let m = new Tone.Time(seconds * bpm / this.baseBpm);
		return m;
	}

	// 	setPlan(interval, bpmStep) {
	// 		this.baseBpm = this.transport.bpm.value

	//         this.transport.cancel();
	// //        this.transport.scheduleRepeat((time) => this.playNote(time), '4n')
	// 		this.transport.position = 0;

	// 		// TODO: unsure if we need to pass currentstep
	// 		this.setAccents(this.currentStep.accents);

	//         let bpm = this.transport.bpm.value;
	//         let t = 0;// Tone.now();
	//         this.events = [];
	//         // var b = bpm ;
	// 		let isMeasure = false;

	//         if (isNaN(interval) && interval.indexOf('m') > 0) {
	//             // interval = this.time(interval).toSeconds();
	//             interval = Number(interval.split('m')[0]);
	//             isMeasure = true;
	//         }
	//         else if (isNaN(interval)) {
	//             throw new Error("Invalid inteval: " + interval)
	//         }

	//         let plan = []
	//         for (let i = 0; i < 6; i++) {
	//             const tt = this.calcTimeForBpm(interval, bpm)
	//             // var b = bpm + bpmStep * i;
	//             plan.push(
	//                 "at " + (isMeasure ? (interval * i + 'm') : (Number(tt).toFixed(1) + 's')) + " : " + bpm
	//             )

	//             let b = bpm;
	//             let transportTime = isMeasure ? "+" + (interval * i) + 'm' : t;
	//             // this.events.push(
	//             let eventId = this.transport.schedule((time) => this.onPlanStep2(time, b, i, eventId), transportTime)
	//             // )
	//             this.events.push(eventId);
	//             t += tt;
	//             bpm += bpmStep
	//         }
	//         // this.setState({ plan: plan })
	//     }


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

	onProgressEvent(time) {
		Tone.Draw.schedule(() => this.onProgress(), time)
	}
	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1000) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {

			Tone.Transport.bpm.value = bpm;
			this.setState({ bpm: bpm })
			// console.log("<SM>bpm changed to", bpm)

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


	toggle() {
		Tone.Transport.state === 'started' ? this.stop() : this.start();
	};

	getTimelineEvent(eventId) {
		return this.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	}

	// onPlanStep2(time, bpm, idx, eventId) {
	// 	console.log('onPlanStep', idx, time.toFixed(1))

	// 	// figure out duration
	// 	const nextEventId = this.events[idx + 1];

	// 	// set next Event so we know how to calculate progress
	// 	const nextEvent = this.getTimelineEvent(nextEventId);// this.transport._timeline._timeline.filter(function (o) { return o.id === nextEventId })[0]
	// 	let duration = Infinity;
	// 	if (nextEvent) {
	// 		duration = nextEvent.time - this.transport.ticks;
	// 	}

	// 	this.currentEvent = this.getTimelineEvent(eventId);
	// 	this.currentEvent.duration = duration;

	// 	// reset progress counter
	// 	this.progress = 0

	// 	// set new bpm
	// 	this.setBpm(bpm);
	// 	this.setState({ step: idx })
	// }

	onPlanStep(bpm) {
		// console.log('<SM>onPlanStep', bpm);
		this.setBpm(bpm);
		// const t = this.refs.planner.calcTimeForBpm(this.progressRefreshRate, bpm)
	}

	// onPlanStep_old(step) {
	// 	if (step.time) {
	// 		console.log('step exact time', step.time)
	// 	}
	// 	if (!step) {
	// 		// console.log('undefined step so stopping')
	// 		this.stop();
	// 		return;
	// 		// throw new Error("Invalid step: " + step);
	// 	} else {
	// 		// console.log("<SM>Setting step: bpm:", step.bpm, "duration", step.duration)
	// 		// debugger
	// 		this.executeStep(step)
	// 	}
	// 	// this.setState({ beatsPerStep: this.currentStep.accents.length })

	// 	//
	// 	//this.executeStep(step);
	// }

	// executeStep(step) {
	// 	if (this.stepEndEvent) {
	// 		this.stepEndEvent.cancel(0)
	// 		this.stepEndEvent.dispose();
	// 		this.stepEndEvent = undefined;
	// 	}

	// 	this.currentStep = step;

	// 	// set new bpm
	// 	this.setBpm(this.currentStep.bpm)

	// 	// update accents/timeSignature
	// 	this.setAccents(this.currentStep.accents)


	// 	if (Tone.Transport.state === 'started') {
	// 		//	this.refs.planner.startStepEvent(this.currentStep.duration);
	// 	}

	// 	if (this.eventCnt !== undefined) {
	// 		this.eventCnt++
	// 	}
	// 	else {
	// 		this.eventCnt = 0;
	// 	}




	// 	this.stepEndEvent = new Tone.Event((time, value) => this.onSequence(time, value), 'event_' + this.eventCnt);
	// 	// execute after this time
	// 	// console.log('end step after ', this.currentStep.duration, 'seconds')
	// 	// this.transport.position = 0;
	// 	// const p = this.transport.seconds + this.currentStep.duration
	// 	// console.log('start event', p)
	// 	if (this.currentStep.time) {
	// 		debugger
	// 	}
	// 	this.stepEndEvent.start("+2");
	// 	// this.transport.position = 0;
	// 	// console.log('next step at ', this.stepEndEvent.loopStart)
	// 	// debugger
	// 	// this.stepSeq.loop = true;


	// 	// console.log('timeline length', this.transport._timeline.length)

	// }

	// onSequence(time, eventName) {
	// 	// this.stepEndEvent.cancel(0)
	// 	// console.log('stepLoop event', time, eventName)
	// 	// debugger
	// 	const p = this.refs.planner;
	// 	p.advance(time);
	// }

	onControlChange() {
		const v = this.refs.control.getValue()
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
										{/* Start / Stop */}
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
								<Col>
									<Control ref='control' cookies={this.props.cookies} onPresetSelect={(preset) => this.onInstrumentSelect(preset.instrument)} onChange={() => this.onControlChange()} /></Col>
							</Row>
							{/* <Row>POS: {this.transport.position}</Row>	 */}

						</SimplePanel>
					</Col>
					<Col>
						{/* <VisClock ref="visClock" width="200" /> */}

						<Planner
							transport={this.transport}
							//					cookies={this.props.cookies}
							// currentBpm={this.refs.sm.transport.bpm.value}
							progress={this.state.progress}
							onChange={() => this.onControlChange()}
							onPlanStep={(bpm) => this.onPlanStep(bpm)}
							ref="planner"
						/>

					</Col>
					<Col>
					<SimplePanel title="Vis">
							<CssClock ref="cssClock" accents={this.state.accents} progress={this.state.loopProgress * 360} />
						</SimplePanel>
						</Col>
				</Row>
				{/* <SimpleVis ref="vis" beats={this.state.beatsPerStep}/> */}

			</Container>
		);
	}

	// setVis(vis) {
	// 	this.vis = vis;
	// }

	stop() {

		this.transport.stop();
		this.transport.position = 0;
		// this.loop.stop();
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

		this.transport.start("+.1");
		this.loop.start()

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
	instrument: InitPreset.instrument,
	accents: InitPreset.accents
};