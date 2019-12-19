import React, { Component } from "react";
import Tone from 'tone'
import Tr, {TrRange} from './Locale'
import { Collapse, ButtonGroup, Button } from "reactstrap";
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
		isUpDown: false,
		isPaused: false
	};

	makePlan(s) {
		let segments = [];
		// some helpful variables
		const max = s.bpmRange[1];
		let bpm = s.bpmRange[0];

		if (s.playMode === PlayModes.BY_BAR) {
			while (bpm <= max) {
				const segment = {
					bpm: bpm,
					duration: s.byBarInterval
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		}
		else if (s.playMode === PlayModes.BY_TIME) {
			while (bpm <= max) {
				const segment = {
					duration: s.byTimeInterval,
					bpm: bpm
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		} else if (s.playMode === PlayModes.CONSTANT) {
			const segment = {
				duration: Infinity,
				bpm: s.constantBpmSlider
			};
			segments.push(segment);
		}
		else if (s.playMode === PlayModes.STEPS) {
			const duration = s.exerciseTime  / (s.stepsNum );
			console.log('exerciseTime', s.exerciseTime)
			
			let bpm = s.bpmRange[0];
			const bpmStep = (s.bpmRange[1] - s.bpmRange[0]) / (s.stepsNum -1 );
			console.log('steps bpmStep', bpmStep)
			while (bpm <= max) {
				const segment = {
					duration: duration,
					bpm: bpm
				};
				segments.push(segment);
				bpm += bpmStep;
			}
		}

		if (this.state.isUpDown) {
			const rev = segments.slice().reverse();
			rev.shift()
			segments = segments.concat(rev);
		}
		if (this.state.isRandom) {
			segments = this.shuffle(segments.slice())
		}
		return segments;
	}

	shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
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

	// getTimelineEvent(eventId) {
	// 	return this.props.transport._timeline._timeline.filter(function (o) { return o.id === eventId })[0];
	// }

	// initProgressUpdate() {

	// 	const fps = 10;
	// 	if (this.progressEventId) {
	// 		this.props.transport.clear(this.progressEventId)
	// 	}
	// 	console.log('<SM>init Progress with fps:', fps)
	// 	this.progressEventId = this.props.transport.scheduleRepeat((time) => this.onProgressEvent(time), 1 / fps, 0)

	// }

	setPlan(config, stepIdx = 0) {
		// store original config so we can recreate it when playback mode changes
		console.log("<Planner>SetPlan", stepIdx)
		const plan = this.makePlan(config);
		this.baseBpm = this.props.transport.bpm.value

		const timeSignature = config.track.length;
		let t = 0;
		this.events = [];
		let steps = []
		let totalPlanTime = 0;

		for (let i = 0; i < plan.length; i++) {
			const s = plan[i];
			const beatDuration = 60 / s.bpm;
			// copy bpm so we can pass it to onPlanStep, not sure how to achieve it otherwise
			let b = s.bpm;

			// create  step end event
			this.props.transport.schedule((time) => this.onPlanStep(i), t)

			const duration = config.playMode === PlayModes.BY_BAR ? beatDuration * timeSignature * s.duration : s.duration;

			const durationInBars = config.playMode === PlayModes.BY_BAR ? s.duration : s.duration / (beatDuration * timeSignature);

			const bar = {
				bpm: s.bpm,
				duration: duration,
				durationBars: durationInBars,
				durationFormatted: Utils.formatTime(duration),
				durationBars: durationInBars.toFixed(1),
				durationFormatted: Utils.formatTime(duration),
				stepIdx: i,
				track: config.track,
				playMode: s.playMode,
				startTimeTicks: Tone.Time(t).toTicks()
			};


			switch (config.playMode) {
				case PlayModes.BY_TIME:
				case PlayModes.STEPS:
					t += this.calcTimeForBpm(s.duration, s.bpm);
					break;
				case PlayModes.BY_BAR:
					t = s.duration * (i + 1) + "m";
					break;
				case PlayModes.CONSTANT:
					t = Infinity
					break;
				default:
					throw new Error('Invalid playMode: ' + config.playMode)
			}

			totalPlanTime += duration
			steps.push(bar);

		}

		console.log('steps', steps)

		this.props.transport.schedule((time) => this.onPlanEnd(time), t);
		this.endTime = Tone.Time(t).toTicks();
		
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
				// hmm this is shit as change in currentStepIdx doesn't move transport, this needs some thinking 
				currentStepIdx: 0,
				steps: steps
			}),
			this.stepChanged
		);
	}

	calcTimeForBpm(seconds, bpm) {
		return Tone.Time(seconds * bpm / this.baseBpm);

	}

	// stop() {
	// 	// console.log("lockBpm", this.props.lockBpm);
	// 	this.resetStep();
	// }

	startStep(stepIdx) {
		if (this.state.currentStepIdx !== stepIdx) {
			console.log("setStep", stepIdx)
			const s = this.getStep(stepIdx);
			// const event = this.getTimelineEvent(this.events[stepIdx])
			this.props.transport.ticks = s.startTimeTicks;
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

	onPlanEnd(time) {
		if (this.state.playbackMode === PlaybackModes.STOP) {
			this.props.onPlanEnd();
		}
		else if (this.state.playbackMode === PlaybackModes.REPEAT) {
			this.startStep(0)
		}

		// if (this.state.playbackMode === PlaybackModes.STOP) {
		// 	this.props.transport.stop();
		// }
	}
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
				className={"step clickable " + cls}
				key={"key_" + b.stepIdx}
			>
				{
					b.duration !== Infinity
						? <>{b.durationFormatted} ({b.durationBars} {TrRange(Math.floor(b.durationBars),"bars")}) </>
						: ''}
				@ {b.bpm.toFixed(0)} bpm
			</div>
		);
	};

	formatTime(date) {
		return date.getMinutes() + ":" + date.getSeconds();
	}
	onUpDownBtn() {
		this.setState({ isUpDown: !this.state.isUpDown, isRandom: false }, this.props.onChange)
	}

	onRandomBtn() {
		this.setState({ isRandom: !this.state.isRandom, isUpDown: false }, this.props.onChange)
	}
	render() {
		return (

			
			<SimplePanel title={"Plan"}>
				<div className="Planner">
					{/* <div>Next step in {this.state.stepProgress.toFixed(1)} seconds</div> */}
					<div>{Tr("Step progress")} <SimpleProgress value={this.state.stepProgress * 100} /></div>
					<div>{Tr("Plan progress")} <SimpleProgress value={ 100 * (this.props.transport.ticks  / this.endTime) } /></div>

					{/* <Button onClick={() => this.togglePause()}>
					isPaused:
					{this.state.isPaused === true ? "paused" : "normal"}
				</Button> */}
					
					<div style={{height: '200px', overflow: 'auto'}}>
						{this.state.steps.map(bar => this.barRender(bar))}
					</div>
					<div>
						{Tr("Total time:")} {Utils.formatTime(this.state.totalPlanTime)}
					</div>
				</div>
				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT}>
					<div>{Tr("After plan")}</div>
					<ButtonGroup size="sm">
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.STOP)}
							active={this.state.playbackMode === PlaybackModes.STOP}
						>
							⏹️
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.CONTINUE)}
							active={this.state.playbackMode === PlaybackModes.CONTINUE}
						>
							▶️
							{/* Cycle back */}
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(PlaybackModes.REPEAT)}
							active={this.state.playbackMode === PlaybackModes.REPEAT}
						>
							🔁
						</Button>
					</ButtonGroup>
					<div>{Tr("Step order")}</div>
					<ButtonGroup>
						<Button
							size="sm"
							outline
							color="light"
							onClick={(e) => this.onUpDownBtn(e)}
							active={this.state.isUpDown}
						>
							{Tr("Up and Down")}

						</Button>
						<Button
							size="sm"
							outline
							// toggle
							color="light"
							onClick={() => this.onRandomBtn()}
							active={this.state.isRandom}
						>
							{Tr("Shuffle")}
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
	onChange: () => { },
	onPlanStep: () => { },
	onPlanEnd: () => { },
	currentStepIdx: NaN
};
