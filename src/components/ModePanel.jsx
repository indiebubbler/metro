import React, { Component } from "react";
import SimplePanel from "./SimplePanel";
import {
	ButtonGroup,
	Button,
	Collapse,
	ButtonDropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu
} from "reactstrap";
import { playModes } from "./PlayModes";
import { playbackModes } from "./PlaybackModes";
import GeometricSlider from "./GeometricSlider";
import AdvancedRange from "./AdvancedRange"
import AdvancedSlider from "./AdvancedSlider"
import Utils from "./Utils";

class ModePanel extends Component {
	state = {
		playbackMode: playbackModes.STOP,
		playMode: playModes.BY_TIME,
		bpmStep: 10,
		bpmStepDropdownOpen: false,
		byTimeInterval: 5,
		byBarInterval: 2,
		stableBpmSlider: 300,
		bpmRange: [100, 250]
	};

	constructor(props) {
		super(props);
		this.state.playMode = props.playMode;
		if (props.playMode === playModes.BY_BAR) {
			this.state.byBarInterval = props.interval;
		} else {
			this.state.byTimeInterval = props.interval;
		}
		this.state.bpmStep = props.bpmStep;
		this.state.bpmRange = props.bpmRange;
		// console.log('<ModePanel> constructor')
	}

	onModeChange(newMode) {
		this.setState({ playMode: newMode }, this.props.onAfterChange);
	}


	onBpmRangeChange(bpmRange) {
		// console.log('<ModePanel>onBpmRangeChange(' + bpmRange[0] + ')')
		this.setState({ bpmRange: bpmRange }, this.props.onAfterChange);
	}

	onBpmSliderChange = (value) => {
		// console.log('onBpmSliderChange', value)
		this.setState({ stableBpmSlider: value }, this.props.onAfterChange);
	}

	onBpmStepChange() {
		this.setState(prevState => ({
			bpmStepDropdownOpen: !prevState.bpmStepDropdownOpen
		}));
	}

	onBpmStepSelect(value) {
		this.setState({ bpmStep: value }, this.props.onAfterChange);
	}

	getValue() {

		// console.log('getValue', this.state.playbackMode)

		const o = {
			playMode: this.state.playMode,
			playbackMode: this.state.playbackMode,
			interval:
				this.state.playMode === playModes.BY_BAR
					? this.state.byBarInterval
					: this.state.byTimeInterval,
			bpmStep: this.state.bpmStep,
			bpmRange: this.state.playMode !== playModes.STABLE ? this.state.bpmRange : this.props.bpmRange,//this.refs.bpmRange.getValue() : null,
			stableBpmSlider: this.state.stableBpmSlider
		};
		// debugger
		return o;
	}

	setValue(o) {
		// console.log("<ModePanel>setValue", o)
		this.setState(
			{
				playMode: o.playMode,
				playBackMode: o.playBackMode || this.state.playBackMode,
				bpmStep: o.bpmStep,
				byBarInterval:
					o.playMode === playModes.BY_BAR
						? o.interval
						: this.state.byBarInterval,
				byTimeInterval:
					o.playMode === playModes.BY_TIME
						? o.interval
						: this.state.byTimeInterval,
				bpmRange: o.bpmRange,
				stableBpmSlider: o.stableBpmSlider || this.state.stableBpmSlider
			},
			this.props.onAfterChange
		);


		const slider =
			o.playMode === playModes.BY_BAR
				? this.refs.byBarSlider
				: this.refs.byTimeSlider;
		slider.setValue(o.interval);

		this.refs.bpmRange.setState({ bounds: o.bpmRange })
	}

	onTimeIntervalChange(v) {
		this.setState({ byTimeInterval: v }, this.props.onAfterChange);
	}

	onBarIntervalChange(v) {
		this.setState({ byBarInterval: v }, this.props.onAfterChange);
	}

	byBarFormatter(barsNum) {
		let s = barsNum + " ";
		if (barsNum === 1) {
			s += "bar";
		} else {
			s += "bars";
		}
		return s;
	}

	byTimeFormatter(time) {
		let s = Utils.formatTime(time) + " ";

		if (time === 1) {
			s += "second";
		} else if (time < 60) {
			s += "seconds";
		} else if (time < 120) {
			s += "minute";
		} else {
			s += "minutes";
		}
		return s;
	}

	onPlaybackChange(newPlaybackMode) {
		this.setState({ playbackMode: newPlaybackMode });
	}

	renderIncreaseBpmDropdown() {
		return (
			<>
				increase speed by
				<ButtonDropdown
					style={{ margin: "0px 5px" }}
					isOpen={this.state.bpmStepDropdownOpen}
					toggle={() => this.onBpmStepChange()}
				>
					<DropdownToggle caret size="sm" outline color="light">
						{this.state.bpmStep}
					</DropdownToggle>
					<DropdownMenu>
						<DropdownItem
							onClick={() => {
								this.onBpmStepSelect(5);
							}}
						>
							5
						</DropdownItem>
						<DropdownItem
							onClick={() => {
								this.onBpmStepSelect(10);
							}}
						>
							10
						</DropdownItem>
						<DropdownItem
							onClick={() => {
								this.onBpmStepSelect(20);
							}}
						>
							20
						</DropdownItem>
						<DropdownItem
							onClick={() => {
								this.onBpmStepSelect(30);
							}}
						>
							30
						</DropdownItem>
						<DropdownItem
							onClick={() => {
								this.onBpmStepSelect(50);
							}}
						>
							50
						</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
				bpm
			</>
		);
	}

	renderSpeedRange() {

		// console.log('renderSpeedRange', this.state.bpmRange[0])
		return (<div>
			Speed range
			<AdvancedRange
				ref="bpmRange"
				min={30}
				max={600}
				defaultValue={[
					this.state.bpmRange[0],
					this.state.bpmRange[1]
				]}
				pushable={true}
				onAfterChange={(value) => this.onBpmRangeChange(value)}
			/>
		</div>);
	}

	render() {
		return (
			<SimplePanel className="ModePanel" title="Mode">
				<ButtonGroup size="sm">
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(playModes.BY_BAR)}
						active={this.state.playMode === playModes.BY_BAR}
					>
						By bar
					</Button>
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(playModes.BY_TIME)}
						active={this.state.playMode === playModes.BY_TIME}
					>
						By time
					</Button>
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(playModes.STABLE)}
						active={this.state.playMode === playModes.STABLE}
					>
						Stable
					</Button>
				</ButtonGroup>

				<Collapse isOpen={this.state.playMode !== playModes.STABLE}>
					{/* {this.state.playMode !== playModes.STABLE ? this.renderSpeedRange() : ''} */}
					{this.renderSpeedRange()}
				</Collapse>


				<Collapse isOpen={this.state.playMode === playModes.BY_BAR}>

					<div>
						Increase speed every
						<GeometricSlider
							ref="byBarSlider"
							defaultValue={this.state.byBarInterval}
							badgeFormatter={this.byBarFormatter}
							onChange={v => this.onBarIntervalChange(v)}
							min={1}
							max={301}
							marksAt={[1, 2, 5, 10, 20, 50, 100, 300]}
						/>
					</div>
				</Collapse>
				<Collapse isOpen={this.state.playMode === playModes.BY_TIME}>

					<div>
						Increase speed every
						<GeometricSlider
							ref="byTimeSlider"
							defaultValue={this.state.byTimeInterval}
							badgeFormatter={this.byTimeFormatter}
							markFormatter={Utils.formatTime}
							onChange={v => this.onTimeIntervalChange(v)}
							min={1}
							max={600}
							marksAt={[1, 2, 5, 10, 30, 60, 120, 240, 600]}
						/>
					</div>
				</Collapse>
				{this.state.playMode !== playModes.STABLE ? this.renderIncreaseBpmDropdown() : ''}
				<Collapse isOpen={this.state.playMode === playModes.STABLE}>
					<div>
						Choose bpm

						<AdvancedSlider
							ref="stableBpmSlider"
							included={false}
							min={10}
							max={600}
							marks={{ 30: '30', 100: '100', 200: '200', 300: '300', 400: '400', 500: '500', 600: '600' }}
							value={this.state.stableBpmSlider}
							onChange={this.onBpmSliderChange}
						/>
					</div>
				</Collapse>

				<Collapse isOpen={this.state.playMode !== playModes.STABLE}>
					<div>After plan</div>
					<ButtonGroup size="sm">
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(playbackModes.STOP)}
							active={this.state.playbackMode === playbackModes.STOP}
						>
							Stop
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(playbackModes.CYCLE)}
							active={this.state.playbackMode === playbackModes.CYCLE}
						>
							Cycle back
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(playbackModes.CONTINUE)}
							active={this.state.playbackMode === playbackModes.CONTINUE}
						>
							Last speed
						</Button>
						<Button
							size="sm"
							outline
							color="light"
							onClick={() => this.onPlaybackChange(playbackModes.REPEAT)}
							active={this.state.playbackMode === playbackModes.REPEAT}
						>
							Start over
						</Button>
					</ButtonGroup>
				</Collapse>
			</SimplePanel>
		);
	}
}

export default ModePanel;

ModePanel.defaultProps = {
	onAfterChange: null
};
