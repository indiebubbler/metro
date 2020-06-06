import React, { Component } from "react";
import Tone from 'tone'
import Tr, { TrRange } from './Locale'
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
		playMode: this.props.playMode,
		steps: [],
		currentStepIdx: this.props.currentStepIdx,
		stepProgress: 0,
		planProgress: 0,
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
		else if (s.playMode === PlayModes.SET_TIME) {

			const duration = s.exerciseTime / (s.stepsNum);

			let bpm = s.bpmRange[0];
			const bpmStep = (s.bpmRange[1] - s.bpmRange[0]) / (s.stepsNum - 1);
			// we compare against max+1 as there might be some fractions that will make last step ignored
			while (bpm <= max + 1) {
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
		this.setState({ currentStepIdx: idx }, this.stepChanged)
	}

	updateProgress() {
		const step = this.getStep(this.state.currentStepIdx);
		const stepProgress = (this.props.transport.ticks - step.startTimeTicks) / (Tone.Time(step.duration).toTicks());
		const planProgress = this.props.transport.ticks / this.endTime;
		this.setState({ stepProgress: this.clamp(stepProgress), planProgress: this.clamp(planProgress) })
	}

	clamp(value, min = 0, max = 1) {
		return Math.min(Math.max(value, min), max);
	}

	setPlan(config, stepIdx = 0) {
		const plan = this.makePlan(config);
		this.baseBpm = this.props.transport.bpm.value

		const timeSignature = config.timeSignature;
		let t = 0;
		this.events = [];
		let steps = []
		let totalPlanTime = 0;

		for (let i = 0; i < plan.length; i++) {
			const s = plan[i];
			const beatDuration = 60 / s.bpm;

			// create  step end event
			this.props.transport.schedule((time) => this.onPlanStep(i), t)

			const duration = config.playMode === PlayModes.BY_BAR ? beatDuration * timeSignature * s.duration : s.duration;
			const durationInBars = config.playMode === PlayModes.BY_BAR ? s.duration : s.duration / (beatDuration * timeSignature);

			const bar = {
				bpm: s.bpm,
				duration: duration,
				durationBars: durationInBars.toFixed(1),
				durationFormatted: Utils.formatTime(duration),
				stepIdx: i,
				track: config.track,
				playMode: s.playMode,
				startTimeTicks: Tone.Time(t).toTicks()
			};


			switch (config.playMode) {
				case PlayModes.BY_TIME:
				case PlayModes.SET_TIME:
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

		this.props.transport.schedule((time) => this.onPlanEnd(time), t);
		this.endTime = Tone.Time(t).toTicks();

		this.setState(
			prevState => ({
				totalPlanTime: totalPlanTime,
				// hmm this is shit as change in currentStepIdx doesn't move transport, this needs some thinking 
				currentStepIdx: 0,
				steps: steps,
				playMode: config.playMode
			}),
			this.stepChanged
		);
	}

	calcTimeForBpm(seconds, bpm) {
		return Tone.Time(seconds * bpm / this.baseBpm);

	}

	startStep(stepIdx) {
		if (this.state.currentStepIdx !== stepIdx) {
			const s = this.getStep(stepIdx);
			this.props.transport.ticks = s.startTimeTicks;
			this.setState({ currentStepIdx: stepIdx }, this.stepChanged)
		}
	}

	getStep(idx) {
		return this.state.steps[idx];
	}

	stepForward() {
		// check if we're not at the end of plan
		if (this.state.currentStepIdx + 1 < this.state.steps.length) {
			this.startStep(this.state.currentStepIdx + 1)
		}
	}

	stepBackward() {
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
	}
	stepChanged() {
		const bpm = this.getCurrentStep().bpm
		this.props.onPlanStep(bpm)
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
						? <>{b.durationFormatted} ({b.durationBars} {TrRange(Math.floor(b.durationBars), "bars")}) </>
						: ''}
				@ {b.bpm.toFixed(0)} bpm
			</div>
		);
	};

	onUpDownBtn() {
		this.setState({ isUpDown: !this.state.isUpDown, isRandom: false }, this.props.onChange)
	}

	onRandomBtn() {
		this.setState({ isRandom: !this.state.isRandom, isUpDown: false }, this.props.onChange)
	}
	render() {
		if (this.state.playMode === PlayModes.CONSTANT) {
			return <div />
		}
		return (

			<SimplePanel title={"Plan"}>
				<div className="Planner">
					{/* <div>Next step in {this.state.stepProgress.toFixed(1)} seconds</div> */}
					<div>{Tr("Step progress")} <SimpleProgress value={this.state.stepProgress * 100} /></div>
					<div>{Tr("Plan progress")} <SimpleProgress value={this.state.planProgress * 100} /></div>

					{/* <Button onClick={() => this.togglePause()}>
					isPaused:
					{this.state.isPaused === true ? "paused" : "normal"}
				</Button> */}

					<div style={{ height: '200px', overflow: 'auto' }}>
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
							onClick={() => this.onPlaybackChange(PlaybackModes.STOP)}
							active={this.state.playbackMode === PlaybackModes.STOP}
						>
							{Tr("Stop")}
						</Button>
						<Button
							size="sm"
							outline
							onClick={() => this.onPlaybackChange(PlaybackModes.CONTINUE)}
							active={this.state.playbackMode === PlaybackModes.CONTINUE}
						>
							{Tr("Continue")}
						</Button>
						<Button
							size="sm"
							outline
							onClick={() => this.onPlaybackChange(PlaybackModes.REPEAT)}
							active={this.state.playbackMode === PlaybackModes.REPEAT}
						>
							{Tr("Repeat")}
						</Button>
					</ButtonGroup>
					<div>{Tr("Step order")}</div>
					<ButtonGroup>
						<Button
							size="sm"
							outline
							onClick={(e) => this.onUpDownBtn(e)}
							active={this.state.isUpDown}
						>
							{Tr("Up and Down")}

						</Button>
						<Button
							size="sm"
							outline
							// toggle
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
	playMode: InitPreset.playMode,
	onChange: () => { },
	onPlanStep: () => { },
	onPlanEnd: () => { },
	currentStepIdx: NaN
};
