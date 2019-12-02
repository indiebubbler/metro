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
					duration: s.byTimeInterval,
					bpm: bpm
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		} else if (s.playMode === PlayModes.CONSTANT) {
			let segment = {
				duration: Infinity,
				bpm: s.stableBpmSlider
			};
			segments.push(segment);
		}

		if (this.state.playbackMode === PlaybackModes.CYCLE) {

			const rev = segments.slice().reverse();
			rev.shift()
			segments = segments.concat(rev);

		}
		return segments;
	}

	onPlanStep(idx) {
// this.props.transport.stop()
		console.log("<Planner>onPlanStep", idx);
		// const idx = this.state.currentStepIdx;
		// this.nextStepIdx = this.getNextStepIdx(idx);
		// this.startStep(idx)

		// debugger
		this.setState({ currentStepIdx: idx }, this.stepChanged)
	}

	updateProgress() {
		// debugger
		let p = 0;
		const step = this.getStep(this.state.currentStepIdx);

		// const t = new Tone.Time(step.duration).toTicks()
		// const sT = new Tone.Time(step.startTime)
		// debugger
		// console.log('t', t.toTicks(), 'sT', sT.toTicks(), 'p', p)
		
		p = (this.props.transport.ticks - step.startTimeTicks) / (Tone.Time(step.duration).toTicks());
		// clamp p
		p = Math.min(Math.max(p, 0), 1);
		this.setState({ stepProgress: p })
	}

	getTimelineEvent(eventId) {
		return this.props.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	}

	initProgressUpdate() {

		const fps = 10;
		if (this.progressEventId) {
			this.props.transport.clear(this.progressEventId)
		}
		console.log('<SM>init Progress with fps:', fps)
		this.progressEventId = this.props.transport.scheduleRepeat((time) => this.onProgressEvent(time), 1 / fps, 0)

	}

	setPlan(config) {
		// store original config so we can recreate it when playback mode changes
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

				const duration = s.duration
				const durationInBars = s.duration / (beatDuration * timeSignature);
				const bar = {
					bpm: s.bpm,
					duration: duration,
					durationBars: durationInBars.toFixed(1),
					durationFormatted: Utils.formatTime(duration),
					stepIdx: i,
					accents: config.accents,
					playMode: PlayModes.BY_TIME,
					startTime: t,
					startTimeTicks: new Tone.Time(t).toTicks()
					// eventId: eventId
				};
		
				t += this.calcTimeForBpm(s.duration, s.bpm);

				totalPlanTime += duration
				steps.push(bar);
			}
			else if (config.playMode === PlayModes.BY_BAR) {

				const startTime =   s.duration * i + "m";
				let eventId = this.props.transport.schedule((time) => this.onPlanStep(i), startTime);
				this.events.push(eventId);

				const duration = beatDuration * timeSignature * s.duration;
				const bar = {
					bpm: s.bpm,
					duration: duration,
					durationBars: s.duration,
					durationFormatted: Utils.formatTime(duration),
					stepIdx: i,
					playMode: PlayModes.BY_BAR,
					accents: config.accents,
					startTime: startTime,
					startTimeTicks: new Tone.Time(startTime).toTicks()
					// eventId: eventId
				};

				totalPlanTime += duration
				steps.push(bar);
			}
		}

		// add an end plan event
		// if (config.playMode === PlayModes.BY_BAR) {
		// 	// console.log('end event at', "+" + plan[0].duration * plan.length + "m")
		// 	// this.props.transport.schedule((time) => this.onPlanEnd(time), "+" + plan[0].duration * plan.length + "m")
		// }
		// else {
		// 	// console.log('end event at', t)
		// 	// this.props.transport.schedule((time) => this.onPlanEnd(time), t)
		// }

		this.setState(
			prevState => ({
				totalPlanTime: totalPlanTime,
				currentStepIdx: 0,
				steps: steps
			}),
			this.stepChanged
		);
	}

	calcTimeForBpm(seconds, bpm) {
		let m = new Tone.Time(seconds * bpm / this.baseBpm);
		return m;
	}

	// stop() {
	// 	// console.log("lockBpm", this.props.lockBpm);
	// 	this.resetStep();
	// }

	startStep(stepIdx) {

		if (this.state.currentStepIdx !== stepIdx) {
			console.log("setStep", stepIdx)
			const event = this.getTimelineEvent(this.events[stepIdx])
			this.props.transport.ticks = event.time;
			this.setState({ currentStepIdx: stepIdx }, this.stepChanged)
		}
	}

	getStep(idx) {
		return this.state.steps[idx];
	}

	isLastStep(idx) {
		return idx === this.state.steps.length - 1;
	}

	isFirstStep(idx) {
		return idx === 0;
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

	// onPlanEnd(time) {
	// 	const nextStep = this.getNextStep();

	// 	this.props.transport.position = this.getTimelineEvent(nextStep.eventId).time
	// }
	stepChanged() {
		// console.log("<Planner>stepChanged", this.getCurrentStep().stepIdx)
		const bpm = this.getCurrentStep().bpm
		this.props.onPlanStep(bpm)
	}

	// getNextStepIdx(idx) {
	// 	switch (this.state.playbackMode) {
	// 		case PlaybackModes.CYCLE:
	// 			if (this.isLastStep(idx)) {
	// 				this.playbackDirection = -1;
	// 			}
	// 			else if (this.isFirstStep(idx)) {
	// 				this.playbackDirection = 1;
	// 			}
	// 			return this.playbackDirection  > 0 ? idx + 1 : idx - 1;
	// 			break;
	// 		case PlaybackModes.STOP && this.isLastStep(idx):
	// 			return NaN
	// 			break;

	// 		default:
	// 			// debugger
	// 			return idx + 1;
	// 	}

	// }
	// getNextStep() {
	// 	let step;

	// 	switch (this.state.playbackMode) {
	// 		case PlaybackModes.CYCLE:
	// 			if (this.isLastStep()) {
	// 				this.playbackDirection = -1;
	// 			}
	// 			if (this.isFirstStep()) {
	// 				this.playbackDirection = 1;
	// 			}
	// 			step = this.playbackDirection == true ? this.getStep(this.state.currentStepIdx + 1) : this.getStep(this.state.currentStepIdx - 1);

	// 			break;
	// 		case PlaybackModes.REPEAT:
	// 			if (this.isLastStep()) {
	// 				step = this.getStep(0);
	// 			} else {
	// 				step = this.getStep(this.state.currentStepIdx + 1);
	// 			}
	// 			break;
	// 		case PlaybackModes.CONTINUE:
	// 			if (this.isLastStep()) {
	// 				// TODO
	// 				let currentMode = this.getCurrentStep().playMode;
	// 				currentMode.playMode = PlayModes.CONSTANT;
	// 				currentMode.stableBpmSlider = this.state.currentBpm;
	// 				this.refs.modePanel.setValue(currentMode);
	// 			}
	// 			else {
	// 				step = this.getStep(this.state.currentStepIdx + 1);
	// 			}
	// 			break;
	// 		case PlaybackModes.STOP:
	// 			if (this.isLastStep()) {
	// 				// passing undefined as step will cause machine to stop
	// 				return undefined
	// 			}
	// 			else {
	// 				step = this.getStep(this.state.currentStepIdx + 1);
	// 			}
	// 			break;
	// 		default:
	// 			step = this.getStep(this.state.currentStepIdx + 1);
	// 	}
	// 	return step;
	// }

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
		this.setState({ playbackMode: newPlaybackMode }, this.props.onChange);
	}

	// makeCyclePlan(steps) {

	// 	// store steps
	// 	// this.initialSteps = this.state.steps.slice()

	// 	// deep copy
	// 	debugger
	// 	if (this.state.playbackMode === PlaybackModes.CYCLE) {
	// 		this.initialSteps = JSON.parse(JSON.stringify(this.state.steps));

	// 		let extraSteps = this.state.steps.slice();
	// 		extraSteps.reverse()
	// 		extraSteps.shift();

	// 		extraSteps.map((el, idx) => {el.stepIdx = this.initialSteps.length + idx })
	// 		let newSteps = [...this.initialSteps, ...extraSteps];
	// 		this.setState({steps: newSteps});
	// 	}
	// 	else {
	// 		if (this.initialSteps) {
	// 			this.setState({steps: this.initialSteps})
	// 		}
	// 	}
	// 	// let extraSteps = [...this.state.steps ]
	// 	// extraSteps.reverse();
	// 	// extraSteps.shift();
	// 	// debugger
	// 	// for (let i = 0 ; i < extraSteps.length ; i++) {
	// 	// 	extraSteps[i].stepIdx = this.state.steps.length + i
	// 	// }
	// 	// let n =  [...this.state.steps, ...extraSteps];
	// 	// debugger
	// 	// this.setState({steps: n})
	// 	// debugger
	// }
	barRender = b => {
		const cls = this.state.currentStepIdx === b.stepIdx ? "current-step" : "";
		return (
			<div
				onClick={() => this.startStep(b.stepIdx)}
				className={"step " + cls}
				key={"key_" + b.stepIdx}
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
	render() {
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
	playbackMode: InitPreset.playbackMode,
	onChange: () => {},
	onPlanStep: () => {},
	currentStepIdx: NaN
};
