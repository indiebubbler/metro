import React, { Component } from "react";
import { Badge } from "reactstrap";
import { playModes } from "./PlayModes";
import SimpleProgress from "./SimpleProgress";
import Utils from "./Utils";

class Planner extends Component {
	state = {
		bars: [],
		stepProgress: 0,
		isPaused: false
	};

	timer = {
		ref: null,
		startTime: null
	};
	stepsCounter = 0;
	// stepProgressUpdateInterval = 1000 / 30; // 30 fps

	makePlan(s) {
		let segments = [];

		if (s.playMode === playModes.BY_BAR) {
			const min = s.bpmRange[0];
			const max = s.bpmRange[1];
			let bpm = min;
			while (bpm <= max) {
				let segment = {
					bpm: bpm,
					duration: s.interval,
					end: s.interval 	// TODO <--- remove this 
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		}
		else if (s.playMode === playModes.BY_TIME) {
			const min = s.bpmRange[0];
			const max = s.bpmRange[1];
			let bpm = min;

			let i = 0;
			while (bpm <= max) {
				let segment = {
					time: i * s.interval,
					start: i * s.interval,
					end: i * s.interval + s.interval,
					duration: s.interval,
					bpm: bpm
				};
				segments.push(segment);
				bpm += s.bpmStep;
			}
		} else if (s.playMode === playModes.STABLE) {
			let segment = {
				time: Infinity, // TODO <--remove
				duration: Infinity,
				bpm: s.stableBpmSlider
			};
			segments.push(segment);
		}
		return segments;
	}

	// TODO: this is ugly
	setPlan(uiStateObject) {
		// debugger
		const plan = this.makePlan(uiStateObject);

		// console.log("<Planner>setPlan", plan);
		var bars = [];

		let totalPlanTime = 0;
		const playMode = uiStateObject.playMode;
		let i = 0;

		switch (uiStateObject.playMode) {
			case playModes.BY_BAR:
				for (i = 0; i < plan.length; i++) {
					const bar = {
						bpm: plan[i].bpm,
						duration: plan[i].end,
						end: plan[i].end,
						step: this.stepsCounter++,
						playMode: playModes.BY_BAR
						
					};

					totalPlanTime +=
						(60 / plan[i].bpm) *
						uiStateObject.beatsPerStep *
						plan[i].end;
					bars.push(bar);
				}
				break;
			case playModes.BY_TIME:
				for (i = 0; i < plan.length; i++) {
					const bar = {
						time: plan[i].time,
						duration: plan[i].end - plan[i].time,	// TODO: remove other unnecesary parameters
						timeEnd: plan[i].end,
						segmentDuration: plan[i].end - plan[i].time,
						startTimeFormatted: Utils.formatTime(plan[i].start),
						endTimeFormatted: Utils.formatTime(plan[i].end),
						bpm: plan[i].bpm,
						playMode: playModes.BY_TIME,
						step: this.stepsCounter++
					};

					totalPlanTime += plan[i].end;

					bars.push(bar);
				}
				break;
			case playModes.STABLE:
				totalPlanTime = Infinity;
				bars.push({
					bpm: plan[0].bpm,
					duration: Infinity,
					playMode: playModes.STABLE,
					time: Infinity,
					step: 0
				});
				// console.log("plan set to play at {0} bpm", plan[0].bpm);
				break;
			default:
				break;
		}

		// update to new state
		this.stepsCounter = 0;

		this.setState(
			prevState => ({
				totalPlanTime: totalPlanTime,
				currentStep: 0,
				bars: bars,
				playMode: playMode
			}),
			() => this.stepChanged()
		);
	}

	stop() {
		// console.log("lockBpm", this.props.lockBpm);
		this.pause();
		this.resetStep();
	}

	setStep(stepIdx) {
		// console.log('this.state.currentStep !== stepIdx',this.state.currentStep , stepIdx)

		if (this.state.currentStep !== stepIdx) {
			this.setState({currentStep: stepIdx}, this.stepChanged)
		}
	}

	isLastStep() {
		return this.state.currentStep === this.state.bars.length -1;
	}
	
	isFirstStep() {
		return this.state.currentStep === 0;
	}


	stepForward() {
		// console.log("<Planner>stepForward()")
		// check if we're not at the end of plan
		if (this.state.currentStep + 1 < this.state.bars.length) {
			this.setStep(this.state.currentStep + 1)
		}
		else {
			// console.log('no more steps')
		}
	}

	stepBackward() {
		// console.log("<Planner>stepBackward()")


		if (this.state.currentStep - 1 >= 0) {
			this.setStep(this.state.currentStep - 1)
		}
	}

	// onInterval() {
	// 	this.stepForward();
	// 	// if (this.timer) {
	// 	// 	// set time when we changed step to be able to render progress easily
	// 	// 	this.timer.startTime = new Date();
	// 	// }
	// }

	start() {
		
	}

	setProgress(progress) {
		this.setState({stepProgress: progress});
	}
	
	stepChanged() {
		// console.log("<Planner>stepChanged")
		const step = this.getCurrentStep();
		this.props.onStep(step);
	}

	resetStep() {
		// console.log('<Planner> resetStep()')
		this.setStep(0)
	}

	getCurrentStep() {
		if (this.state.currentStep >= this.state.bars.length) {
			throw new Error("Trying to get step that doesn't exists");
		}
		return this.state.bars[this.state.currentStep];
	}

	barRender = b => {
		const cls = this.state.currentStep === b.step ? "current-step" : "";

		return (
			<div
				onClick={() => this.setStep(b.step)}
				className={"step " + cls}
				key={"key_" + b.bpm}
			>
				{b.segmentDuration !== undefined
					? Utils.formatTime(b.segmentDuration.toFixed(0)) + " "
					: b.end + " bars "}
				at {b.bpm.toFixed(0)}
			</div>
		);
	};

	formatTime(date) {
		return date.getMinutes() + ":" + date.getSeconds();
	}
 
	render() {
		if (this.state.bars.length === 0) {
			return <div>No plan</div>;
		}
		else if (this.state.bars[0].time === Infinity) {
			return (
				<div>
					{/* Playing at constant speed {this.state.bars[0].bpm} bpm */}
					<h2><Badge color="dark">BPM: {this.props.currentBpm}</Badge></h2>
				</div>
			);
		}

		return (
			<div className="Planner">
				<h2><Badge color="dark">BPM: {this.props.currentBpm}</Badge></h2>
				{/* <div>Next step in {this.state.stepProgress.toFixed(1)} seconds</div> */}
				<SimpleProgress value={this.state.stepProgress * 100} />

				{/* <Button onClick={() => this.togglePause()}>
					isPaused:
					{this.state.isPaused === true ? "paused" : "normal"}
				</Button> */}

				<div style={this.props.lockBpm ? { opacity: 0.5 } : {}}>
					{this.state.bars.map(bar => this.barRender(bar))}
				</div>
				<div>
					Total time: {Utils.formatTime(this.state.totalPlanTime)}
				</div>
			</div>
		);
	}
}

export default Planner;

Planner.defaultProps = {
	playMode: playModes.BY_BAR,
	currentStep: 0,
	onStep: function(step) {}
};
