import React, { Component } from "react";
import Tone from 'tone'

import { Collapse, ButtonGroup, Badge, Button } from "reactstrap";
import SimplePanel from "./SimplePanel"
import { PlayModes } from "./PlayModes";
import { PlaybackModes } from "./PlaybackModes";
import SimpleProgress from "./SimpleProgress";
import Utils from "./Utils";
import { InitPreset } from "./PresetsLib";

// import Control from "./Control"
class Planner extends Component {
	state = {
		playbackMode: this.props.playbackMode,
		steps: [],
		currentStepIdx: this.props.currentStepIdx,
		stepProgress: 0,
		isPaused: false
	};

	// timer = {
	// 	ref: null,
	// 	startTime: null
	// };
	stepIdx = 0;
	// stepProgressUpdateInterval = 1000 / 30; // 30 fps

	makePlan(s) {
		let segments = [];
		if (s.playMode === PlayModes.BY_BAR) {
			const min = s.bpmRange[0];
			const max = s.bpmRange[1];
			let bpm = min;
			while (bpm <= max) {
				let segment = {
					bpm: bpm,
					duration: s.byBarInterval
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		}
		else if (s.playMode === PlayModes.BY_TIME) {
			const min = s.bpmRange[0];
			const max = s.bpmRange[1];
			let bpm = min;

			while (bpm <= max) {
				let segment = {
					// time: i * s.interval,
					// start: i * s.interval,
					// end: i * s.interval + s.interval,
					duration: s.byTimeInterval,
					bpm: bpm
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		} else if (s.playMode === PlayModes.CONSTANT) {
			let segment = {
				// time: Infinity, // TODO <--remove
				duration: Infinity,
				bpm: s.stableBpmSlider
			};
			segments.push(segment);
		}
		// debugger
		return segments;
	}
	// makePlan(s) {
	// 	let segments = [];

	// 	if (s.playMode === playModes.BY_BAR) {
	// 		const min = s.bpmRange[0];
	// 		const max = s.bpmRange[1];
	// 		let bpm = min;
	// 		while (bpm <= max) {
	// 			let segment = {
	// 				bpm: bpm,
	// 				duration: s.interval,
	// 				end: s.interval 	// TODO <--- remove this
	// 			};
	// 			segments.push(segment);
	// 			bpm += s.bpmStep;
	// 		}
	// 	}
	// 	else if (s.playMode === playModes.BY_TIME) {
	// 		const min = s.bpmRange[0];
	// 		const max = s.bpmRange[1];
	// 		let bpm = min;

	// 		let i = 0;
	// 		while (bpm <= max) {
	// 			let segment = {
	// 				time: i * s.interval,
	// 				start: i * s.interval,
	// 				end: i * s.interval + s.interval,
	// 				duration: s.interval,
	// 				bpm: bpm
	// 			};
	// 			segments.push(segment);
	// 			bpm += s.bpmStep;
	// 		}
	// 	} else if (s.playMode === playModes.STABLE) {
	// 		let segment = {
	// 			time: Infinity, // TODO <--remove
	// 			duration: Infinity,
	// 			bpm: s.stableBpmSlider
	// 		};
	// 		segments.push(segment);
	// 	}
	// 	return segments;
	// }



	// advance() {
	// 	console.log("<Planner>advance")
	// 	this.setState({currentStepIdx: this.getNextStep().stepIdx}, this.onPlanStep)
	// }

	onPlanStep( idx) {
		// figure out duration
		console.log("<Planner>onPlanStep", idx)
		// const idx = this.steps[this.state.currentStepIdx]

		// const idx = this.state.currentStepIdx;
//		const idx = this.state.currentStepIdx;

		const step = this.state.steps[idx];

		const bpm = step.bpm;
		// set next Event so we know how to calculate progress


		this.setState({currentStepIdx: idx}, this.stepChanged)
		// this.stepChanged();
		// let duration = Infinity;
		// if (this.nextEvent) {
		// 	duration = this.nextEvent.time - this.props.transport.ticks;
		// }

	}

	updateProgress() {

		let p = 0;
		// if (this.currentEvent) {
		// 	p = 1 - ((this.currentEvent.time + this.currentEvent.duration) - this.props.transport.ticks) / this.currentEvent.duration;
		// }
		if (this.nextEvent) {

			p = ( this.props.transport.ticks - this.currentEvent.time ) / ( this.nextEvent.time - this.currentEvent.time )
			if (p === Infinity) {
				p = 0;
				// console.log('p == Infinity')
			}
		}
		// clamp p
		p = Math.min(Math.max(p, 0), 1);
		this.setState({ stepProgress: p })
	}
	getTimelineEvent(eventId) {
		return this.props.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	}

	setPlan(config) {

		console.log("<Planner>SetPlan")
		const plan = this.makePlan(config);

		this.baseBpm = this.props.transport.bpm.value

		const timeSignature = config.accents.length;
		let t = 0;
		this.events = [];
		let steps = []
		let totalPlanTime = 0;

		for (let i = 0; i < plan.length; i++) {
			const s = plan[i];
			const beatDuration = 60 / s.bpm;
			// copy bpm so we can pass it to onPlanStep, not sure how to achieve it otherwise
			let b = s.bpm;

			if (config.playMode === PlayModes.BY_TIME) {


				// let eventId = this.props.transport.schedule((time) => this.onPlanStep(time), t)
				let eventId = this.props.transport.schedule((time) => this.onPlanStep(i), t)
				this.events.push(eventId);
				t += this.calcTimeForBpm(s.duration, s.bpm);

				const duration = s.duration
				const durationInBars = s.duration / (beatDuration * timeSignature);
				const bar = {
					bpm: s.bpm,
					duration: duration,
					durationBars: durationInBars.toFixed(1),
					durationFormatted: Utils.formatTime(duration),
					stepIdx: i,
					accents: config.accents,
					playMode: PlayModes.BY_TIME
				};

				totalPlanTime += duration
				steps.push(bar);
			}
			else if (config.playMode === PlayModes.BY_BAR) {

				let eventId = this.props.transport.schedule((time) => this.onPlanStep(i), "+" + s.duration * i + "m");
				this.events.push(eventId);

				// const bpm = plan[i].bpm;
				// const beatDuration = 60 / bpm;
				const duration = beatDuration * timeSignature * s.duration;
				const bar = {
					bpm: s.bpm,
					duration: duration,
					durationBars: s.duration,
					durationFormatted: Utils.formatTime(duration),
					stepIdx: i,
					playMode: PlayModes.BY_BAR,
					accents: config.accents
				};

				totalPlanTime += duration
				steps.push(bar);
			}
		}

		this.setState(
			prevState => ({
				totalPlanTime: totalPlanTime,
				currentStepIdx: 0,
				steps: steps
				// playMode: playMode
			}),
			() => this.stepChanged()
		);


		//     let transportTime = isMeasure ? "+" + (interval * i) + 'm' : t;
		//     // this.events.push(
		//     let eventId = this.transport.schedule((time) => this.onPlanStep(time, b, i, eventId), transportTime)
		//     // )
		//     this.events.push(eventId);
		//     t += tt;
		//     bpm += bpmStep
		// }
		// this.setState({ plan: plan })


		// for (let i = 0; i < plan.length; i++) {
		// 	plan[i].bpm




		// };
	}

	// setPlanOld(config) {
	// 	// console.log("<Planner>SetPlan")
	// 	const plan = this.makePlan(config);

	// 	var steps = [];

	// 	const timeSignature = config.accents.length;

	// 	let totalPlanTime = 0;
	// 	let i = 0;

	// 	let stepIdx = 0;

	// 	switch (config.playMode) {
	// 		case PlayModes.BY_BAR:

	// 			for (i = 0; i < plan.length; i++) {
	// 				const bpm = plan[i].bpm;
	// 				const beatDuration = 60 / bpm;
	// 				const duration = beatDuration * timeSignature * plan[i].duration;
	// 				const bar = {
	// 					bpm: plan[i].bpm,
	// 					duration: duration,
	// 					durationBars: plan[i].duration,
	// 					durationFormatted: Utils.formatTime(duration),
	// 					stepIdx: i,
	// 					playMode: PlayModes.BY_BAR,
	// 					accents: config.accents
	// 				};

	// 				totalPlanTime += duration
	// 				steps.push(bar);
	// 			}
	// 			break;

	// 		case PlayModes.BY_TIME:
	// 			for (i = 0; i < plan.length; i++) {
	// 				const bpm = plan[i].bpm;
	// 				const beatDuration = 60 / bpm;
	// 				const duration = plan[i].duration;
	// 				const durationInBars = plan[i].duration / (beatDuration * timeSignature);
	// 				const bar = {
	// 					bpm: plan[i].bpm,
	// 					duration: duration,
	// 					durationBars: durationInBars.toFixed(1),
	// 					durationFormatted: Utils.formatTime(duration),
	// 					stepIdx: i,
	// 					accents: config.accents,
	// 					playMode: PlayModes.BY_TIME
	// 				};

	// 				totalPlanTime += duration
	// 				steps.push(bar);

	// 				// console.log('calc time', beat * timeSignature * plan[i].interval)

	// 			}
	// 			break;
	// 		case PlayModes.CONSTANT:
	// 			totalPlanTime = Infinity;
	// 			steps.push({
	// 				bpm: plan[0].bpm,
	// 				duration: Infinity,
	// 				playMode: PlayModes.CONSTANT,
	// 				accents: config.accents,
	// 				time: Infinity,
	// 				stepIdx: 0
	// 			});
	// 			// console.log("plan set to play at {0} bpm", plan[0].bpm);
	// 			break;
	// 		default:
	// 			break;
	// 	}

	// 	this.setState(
	// 		prevState => ({
	// 			totalPlanTime: totalPlanTime,
	// 			currentStepIdx: 0,
	// 			steps: steps
	// 			// playMode: playMode
	// 		}),
	// 		() => this.stepChanged()
	// 	);

	// }
	calcTimeForBpm(seconds, bpm) {
		let m = new Tone.Time(seconds * bpm / this.baseBpm);
		return m;
	}

	// setPlan2(uiStateObject, transport) {
	// 	// // debugger
	// 	const plan = this.makePlan(uiStateObject);

	// 	var bars = [];

	// 	transport.timeSignature = uiStateObject.accents.length;

	// 	let totalPlanTime = 0;
	// 	const playMode = uiStateObject.playMode;
	// 	let i = 0;

	// 	switch (uiStateObject.playMode) {
	// 		case PlayModes.BY_BAR:
	// 		case PlayModes.BY_TIME:
	// 			for (i = 0; i < plan.length; i++) {
	// 				transport.bpm.value = plan[i].bpm;

	// 				const t = new Tone.Time(plan[i].duration + (uiStateObject.playMode === PlayModes.BY_BAR ? 'm' : ''));
	// 				// console.log(t)
	// 				const bar = {
	// 					bpm: plan[i].bpm,
	// 					duration: t.toSeconds(),
	// 					durationBars: t.toBarsBeatsSixteenths().split(':')[0],
	// 					durationFormatted: Utils.formatTime(t.toSeconds()),
	// 					// end: plan[i].end,
	// 					step: this.stepsCounter++//,
	// 					 playMode: playModes.BY_BAR
	// 				};

	// 				totalPlanTime += t.toSeconds();
	// 				bars.push(bar);
	// 			}
	// 			break;
	// 		case PlayModes.CONSTANT:
	// 			totalPlanTime = Infinity;
	// 			bars.push({
	// 				bpm: plan[0].bpm,
	// 				duration: Infinity,
	// 				playMode: PlayModes.CONSTANT,
	// 				time: Infinity,
	// 				step: 0
	// 			});
	// 			// console.log("plan set to play at {0} bpm", plan[0].bpm);
	// 			break;
	// 		default:
	// 			break;
	// 	}

	// 	// debugger
	// 	// update to new state
	// 	this.stepsCounter = 0;

	// 	this.setState(
	// 		prevState => ({
	// 			totalPlanTime: totalPlanTime,
	// 			currentStep: 0,
	// 			bars: bars
	// 			// playMode: playMode
	// 		}),
	// 		() => this.stepChanged()
	// 	);
	// }
	// setPlan(uiStateObject) {
	// 	// debugger
	// 	const plan = this.makePlan(uiStateObject);

	// 	// console.log("<Planner>setPlan", plan);
	// 	var bars = [];

	// 	let totalPlanTime = 0;
	// 	const playMode = uiStateObject.playMode;
	// 	let i = 0;

	// 	switch (uiStateObject.playMode) {
	// 		case playModes.BY_BAR:

	// 			for (i = 0; i < plan.length; i++) {
	// 				const bar = {
	// 					bpm: plan[i].bpm,
	// 					duration: plan[i].end,
	// 					//		durationAsTime: Tone.Time(plan[i].end +'m'),
	// 					end: plan[i].end,
	// 					step: this.stepsCounter++,
	// 					playMode: playModes.BY_BAR

	// 				};

	// 				totalPlanTime +=
	// 					(60 / plan[i].bpm) *
	// 					uiStateObject.beatsPerStep *
	// 					plan[i].end;
	// 				bars.push(bar);
	// 			}
	// 			break;
	// 		case playModes.BY_TIME:
	// 			for (i = 0; i < plan.length; i++) {
	// 				const segmentDuration = plan[i].end - plan[i].time;
	// 				const bar = {
	// 					time: plan[i].time,
	// 					duration: segmentDuration,	// TODO: remove other unnecesary parameters
	// 					//	durationAsTime: Tone.Time(segmentDuration).quantize('1m'),
	// 					timeEnd: plan[i].end,
	// 					// segmentDuration: segmentDuration,
	// 					startTimeFormatted: Utils.formatTime(plan[i].start),
	// 					endTimeFormatted: Utils.formatTime(plan[i].end),
	// 					bpm: plan[i].bpm,
	// 					playMode: playModes.BY_TIME,
	// 					step: this.stepsCounter++
	// 				};

	// 				totalPlanTime += plan[i].end;

	// 				bars.push(bar);
	// 			}
	// 			break;
	// 		case playModes.STABLE:
	// 			totalPlanTime = Infinity;
	// 			bars.push({
	// 				bpm: plan[0].bpm,
	// 				duration: Infinity,
	// 				playMode: playModes.STABLE,
	// 				time: Infinity,
	// 				step: 0
	// 			});
	// 			// console.log("plan set to play at {0} bpm", plan[0].bpm);
	// 			break;
	// 		default:
	// 			break;
	// 	}

	// 	// update to new state
	// 	this.stepsCounter = 0;

	// 	this.setState(
	// 		prevState => ({
	// 			totalPlanTime: totalPlanTime,
	// 			currentStep: 0,
	// 			bars: bars,
	// 			playMode: playMode
	// 		}),
	// 		() => this.stepChanged()
	// 	);
	// }

	stop() {
		// console.log("lockBpm", this.props.lockBpm);
		this.resetStep();
	}

	startStep(stepIdx) {

		// console.log('this.state.currentStep !== stepIdx',this.state.currentStep , stepIdx)
		if (this.state.currentStepIdx !== stepIdx) {
			console.log("setStep", stepIdx)

			const event = this.getTimelineEvent(this.events[stepIdx])
			this.props.transport.ticks = event.time;
			// this.progress = 0;
			this.setState({ currentStepIdx: stepIdx }, this.stepChanged)
		}
	}

	getStep(idx) {
		return this.state.steps[idx];
	}

	isLastStep() {
		return this.state.currentStepIdx === this.state.steps.length - 1;
	}

	isFirstStep() {
		return this.state.currentStepIdx === 0;
	}


	stepForward() {
		// console.log("<Planner>stepForward()")
		// check if we're not at the end of plan
		if (this.state.currentStepIdx + 1 < this.state.steps.length) {
			this.startStep(this.state.currentStepIdx + 1)
		}
		else {
			// console.log('no more steps')
		}
	}

	stepBackward() {
		// console.log("<Planner>stepBackward()")


		if (this.state.currentStepIdx - 1 >= 0) {
			this.startStep(this.state.currentStepIdx - 1)
		}
	}

	setProgress(progress) {
		this.setState({ stepProgress: progress });
	}


	// onStepEvent = (time) => {
	// 	// console.log('onStepEvent', time);
	// 	if (this.stepEvent.initialized && this.stepEvent.initialized === true) {
	// 		this.stepEvent.cancel();
	// 		// console.log('onStepEvent','finished')

	// 		this.onStepEnd(time);
	// 		return;
	// 	}

	// 	if (!this.stepEvent.initialized) {
	// 		// console.log('onStepEvent','started', Date.now())
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

	// 	console.log('scheduled event to execute after ', interval.toFixed(2), 'seconds');
	// 	// this.timer = Tone.Time.now()
	// 	// Tone.Transport.schedule(time => this.props.onLoopEnd(time), interval)

	// }

	// advance(time) {
	// 	const step = this.getNextStep();
	// 	step.time = time;
	// 	if (step) {
	// 		this.startStep(step.stepIdx)
	// 	}
	// 	else {
	// 		// no step so just stop
	// 		this.props.onStep(null);
	// 	}
	// }

	stepChanged() {
		console.log("<Planner>stepChanged", this.getCurrentStep())

		const currentStep = this.getCurrentStep()
		const idx = currentStep.stepIdx;
		const bpm = currentStep.bpm
		this.currentEvent = this.getTimelineEvent(this.events[idx]);
		// this.currentEvent.duration = duration;
		// console.log('current event duration', duration)

		// reset progress counter
		this.progress = 0

		// this.setState({ currentStepIdx: idx })
		this.props.onPlanStep(bpm)

		const nextStep = this.getNextStep();
		if (nextStep) {

			const nextEventId = this.events[this.getNextStep().stepIdx];
		
			this.nextEvent = this.getTimelineEvent(nextEventId);
				
		}
else {
	debugger
}


		// this.props.onPlanStep(this.getCurrentStep().bpm);
	}

	getNextStep() {
		let step;

		switch (this.state.playbackMode) {
			case PlaybackModes.CYCLE:
				if (this.isLastStep()) {
					this.playbackDirection = -1;
				}
				if (this.isFirstStep()) {
					this.playbackDirection = 1;
				}
				step = this.playbackDirection == true ? this.getStep(this.state.currentStepIdx + 1) : this.getStep(this.state.currentStepIdx - 1);

				break;
			case PlaybackModes.REPEAT:
				if (this.isLastStep()) {
					step = this.getStep(0);
				} else {
					step = this.getStep(this.state.currentStepIdx + 1);
				}
				break;
			case PlaybackModes.CONTINUE:
				if (this.isLastStep()) {
					// TODO
					let currentMode = this.getCurrentStep().playMode;
					currentMode.playMode = PlayModes.CONSTANT;
					currentMode.stableBpmSlider = this.state.currentBpm;
					this.refs.modePanel.setValue(currentMode);
				}
				else {
					step = this.getStep(this.state.currentStepIdx + 1);
				}
				break;
			case PlaybackModes.STOP:
				if (this.isLastStep()) {
					// passing undefined as step will cause machine to stop
					return undefined
				}
				else {
					step = this.getStep(this.state.currentStepIdx + 1);
				}
				break;
			default:
				step = this.getStep(this.state.currentStepIdx + 1);
		}
		return step;
	}


	resetStep() {
		this.startStep(0)
	}

	getCurrentStep() {
		if (this.state.currentStepIdx >= this.state.steps.length) {
			throw new Error("Trying to get step that doesn't exists");
		}
		return this.state.steps[this.state.currentStepIdx];
	}

	onPlaybackChange(newPlaybackMode) {
		this.setState({ playbackMode: newPlaybackMode });
	}

	// onStepEnd(time) {
	// 	console.log("Planner.onStepEnd executed after ", ((Date.now() - this.timer) / 1000).toFixed(1))

	// 	const pm = this.state.playbackMode;
	// 	// console.log('playbackMode', pm)
	// 	switch (pm) {
	// 		case PlaybackModes.CYCLE:
	// 			this.playbackDirection === true ? this.stepForward() : this.stepBackward();

	// 			if (this.isLastStep() || this.isFirstStep()) {
	// 				this.playbackDirection = !this.playbackDirection;
	// 			}
	// 			break;
	// 		case PlaybackModes.REPEAT:
	// 			if (this.isLastStep()) {
	// 				this.setStep(0);
	// 			} else {
	// 				this.stepForward();
	// 			}
	// 			break;
	// 		case PlaybackModes.CONTINUE:
	// 			if (this.isLastStep()) {
	// 				let currentMode = this.getCurrentStep().playMode;
	// 				currentMode.playMode = PlayModes.CONSTANT;
	// 				currentMode.stableBpmSlider = this.state.currentBpm;
	// 				this.refs.modePanel.setValue(currentMode);
	// 			}
	// 			else {
	// 				this.stepForward();
	// 			}
	// 			break;
	// 		case PlaybackModes.STOP:
	// 			if (this.isLastStep()) {
	// 				// passing null as step will cause machine to stop
	// 				this.props.onStep(null);
	// 			}
	// 			else {
	// 				this.stepForward();
	// 			}
	// 			break;
	// 		default:
	// 			this.stepForward();
	// 	}


	// }

	barRender = b => {
		const cls = this.state.currentStepIdx === b.stepIdx ? "current-step" : "";
		return (
			<div
				onClick={() => this.startStep(b.stepIdx)}
				className={"step " + cls}
				key={"key_" + b.bpm}
			>
				{
					b.duration !== Infinity
						? <>{b.durationFormatted} ({b.durationBars} bars) </>
						: ''}
				@ {b.bpm.toFixed(0)} bpm
			</div>
		);
	};

	formatTime(date) {
		return date.getMinutes() + ":" + date.getSeconds();
	}

	start() {
		console.log('<SM>Start', this.props)
		// this.currentBeat = 0;
		this.setState({ isPlaying: true })
		this.executeStep(this.currentStep)
		// this.setState({ isPlaying: true });
		// this.transport.position = 0;
		// this.loop.position = 0;
		// this.transport.position = 0;

		// this.transport.start();

		// this.stepEvent.start();
	}


	// toggle() {
	// 	if (Tone.Transport.state === 'started') {
	// 		this.stop();
	// 	} else {
	// 		// this.setStep(this.currentStep);
	// 		this.start(this.getCurrentStep());
	// 		// // this.start(this.currentStep);
	// 	}
	// }

	render() {
		// if (this.state.bars.length === 0) {
		// 	return <div>No plan</div>;
		// }
		// else if (this.state.bars[0].time === Infinity) {
		// 	return (
		// 		<div>
		// 			{/* Playing at constant speed {this.state.bars[0].bpm} bpm */}
		// 			<h2><Badge color="dark">BPM: {this.props.currentBpm}</Badge></h2>
		// 		</div>
		// 	);
		// }

		return (

			<SimplePanel title={"Plan"}>
				<div className="Planner">
					{/* <div>Next step in {this.state.stepProgress.toFixed(1)} seconds</div> */}
					<SimpleProgress value={this.state.stepProgress * 100} />

					{/* <Button onClick={() => this.togglePause()}>
					isPaused:
					{this.state.isPaused === true ? "paused" : "normal"}
				</Button> */}

					<div style={this.props.lockBpm ? { opacity: 0.5 } : {}}>
						{this.state.steps.map(bar => this.barRender(bar))}
					</div>
					<div>
						Total time: {Utils.formatTime(this.state.totalPlanTime)}
					</div>
				</div>
				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT}>
					<div>After plan</div>
					<ButtonGroup size="sm">
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.STOP)}
							active={this.state.playbackMode === PlaybackModes.STOP}
						>
							Stop
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.CYCLE)}
							active={this.state.playbackMode === PlaybackModes.CYCLE}
						>
							Cycle back
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.CONTINUE)}
							active={this.state.playbackMode === PlaybackModes.CONTINUE}
						>
							Last speed
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.REPEAT)}
							active={this.state.playbackMode === PlaybackModes.REPEAT}
						>
							Start over
						</Button>
					</ButtonGroup>
				</Collapse>

			</SimplePanel>



		);
	}
}

export default Planner;

Planner.defaultProps = {
	// playMode: PlayModes.BY_BAR,
	playbackMode: InitPreset.playbackMode,
	currentStepIdx: NaN,
	onStep: function (step) { }
};
