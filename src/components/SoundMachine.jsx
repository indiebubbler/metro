import React, { Component } from "react";
import Tone from "tone";
import { accentTypes } from "./AccentTypes";
import InstrumentLib from "./InstrumentLib";
import { Button } from 'reactstrap'
import { playModes } from "./PlayModes";

class SoundMachine extends Component {

	accentNotes = ["C3", "C#3", "D3"]; // this stay in sync with AccentTypes

	instrumentLib = undefined;

	currentBeat = 0;
	beatsPerStep = 4;

	progressRefreshRate = 1000 / 60; // fps

	score = ["C3", "C#3", "C#3", "C#3"];

	state = {
		isPlaying: false
	};

	accents = [accentTypes.ACCENT_1]; // default with accent on first beat


	constructor(props) {
		super(props);

		// init instruments library
		this.instrumentLib = new InstrumentLib(this.props.instrument)
	}

	onBufferError() {
		throw new Error("Some buffers weren't found")
	}

	onStop() {
		// console.log('onStop')
		this.props.onToggle(this.state.isPlaying)

		clearInterval(this.stepProgressUpdateTimer);
	}

	onStart() {
		this.props.onToggle(this.state.isPlaying)

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
		// Tone.Transport.on('start', () => console.log('TRANSPORT.start'));
		Tone.Transport.on('loop', (time) => this.props.onLoopEnd(time));

		Tone.context.latencyHint = "playback";

		Tone.Transport.timeSignature = 4;// [this.beatsPerStep, 4];

		Tone.Transport.loop = true;
		Tone.Transport.loopEnd = "1m"

		this.loop = new Tone.Loop((time) => this.repeat(time), "4n");
		this.loop.start()
		// console.log('Transport loopEnd set to', Tone.Transport.loopEnd)

		//Tone.Transport.scheduleRepeat((time) => this.repeat(time), "4n");


	}

	updateProgress() {
		this.props.onProgress(Tone.Transport.progress);

		if (this.vis) {
			this.vis.drawFFT(this.instrumentLib.fft.getValue())
		}

	}

	setStep(step) {
		// console.log("<SM>store step:", step)

		if (step === this.currentStep) {
			// console.log('step didnt changed so continue only')
			return;
		}
		this.currentStep = step;

		if (this.state.isPlaying === true) {
			// console.log("<SM>execute step:", step)
			this.executeStep(step)
		}
		return this.currentStep.bpm
	}

	executeStep = (step) => {
		// console.log('executeStep ', step)

		
		if (this.lastStep !== step) {
			this.lastStep = step;
			this.currentStep = step;

			if (this.getBpm() !== step.bpm) {
				this.setBpm(step.bpm)
			}

			const newLE =  this.currentStep.playMode === playModes.BY_TIME ?  step.duration : step.duration + 'm';
			// console.log('new Loop End', newLE)
			Tone.Transport.setLoopPoints(0,  newLE);
			Tone.Transport.lastLoopDuration = this.currentStep.duration;
		}


		if (Tone.Transport.state === 'stopped') {
			Tone.Transport.start("+0.01")
		}

	}

	repeat = (time) => {
		const idx = this.currentBeat++ % this.beatsPerStep;

		const note = this.score[idx];

		// make sound
		this.instrumentLib.getInstrument().triggerAttack(note, time);




		// draw stuff
		Tone.Draw.schedule(() => this.onBeat(idx), time)
	}

	setInstrument(instrumentKey) {
		this.instrumentLib.setInstrument(instrumentKey);
	}

	getCurrentInstrumentLabel() {
		return this.instrumentLib.getInstrument().label;
	}

	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1000) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== Tone.Transport.bpm.value) {
			Tone.Transport.bpm.value = bpm;
			Tone.Transport.loopEnd = "1m"
			// console.log('bpm changed to', bpm)
		}
	};

	setBeatsPerStep = newBps => {
		// console.log("<SoundMachine>setBeatsPerStep", newBps)


		this.beatsPerStep = newBps;

		// remove if needed
		while (this.score.length > newBps) {
			this.score.pop();
		}

		// add if needed
		while (this.score.length < newBps) {
			this.score.push(accentTypes.ACCENT_1)
		}

		Tone.Transport.timeSignature = newBps;//[newBps, 4];
		Tone.Transport.loop = true;

		// this will refresh visualisation
		this.setState({ beatsPerStep: newBps })
	};

	onBeat = (currentBeat) => {
		this.props.onBeat(currentBeat);

		// this.fft.connect(Tone.Master);

		// console.log('beat', this.fft.getValue())
	}

	setAccents(accentTypesArr) {
		this.accents = accentTypesArr;

		for (let i = 0; i < this.score.length; i++) {
			// by default 2 will be the tick note
			let note = this.accentNotes[accentTypes.ACCENT_2];

			// if accent for this step is specified set it here
			if (
				accentTypesArr[i] !== undefined &&
				accentTypesArr[i] === accentTypes.ACCENT_1
			) {
				note = this.accentNotes[accentTypes.ACCENT_1];
			} else if (
				accentTypesArr[i] !== undefined &&
				accentTypesArr[i] === accentTypes.ACCENT_3
			) {
				note = this.accentNotes[accentTypes.ACCENT_3];
			}
			this.score[i] = note;
		}
	}

	handleStartStop = () => {
		// console.log("<SM>HandleStartStop, state:", Tone.Transport.state)

		if (Tone.Transport.state === 'started') {
			this.stop();

		} else {
			this.start(this.currentStep);
		}
	};

	render() {
		return (

			<Button
				outline
				color="light"
				onClick={() => this.handleStartStop()}
				block
				active={this.state.isPlaying}
			>
				Start / Stop
			</Button>

			// <div style={{width: '100%'}}>
			// 	{/* <div>Sound is {this.state.isPlaying === true ? "playing" : "stopped"}</div> */}
			// 	{/* <SimpleVis ref="vis" beats={this.state.beatsPerStep}/> */}
			// </div>
		);
	}

	setVis(vis) {
		this.vis = vis;
	}
	stop() {
		// console.log('<SM>stop')
		this.setState({ isPlaying: false });
		this.currentBeat = 0;
		Tone.Transport.stop();
	}

	start(step) {
		// console.log('<SM>Start')
		this.setState({ isPlaying: true }, this.executeStep(step));

	}

	getBpm = () => {
		return Tone.Transport.bpm.value;
	};
}

export default SoundMachine;


SoundMachine.defaultProps = {
	beatsPerStep: 4,
	onLoopEnd: function (time) { },
	onToggle: function (state) { },
	onProgress: function (progress) { }
};