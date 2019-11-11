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
import { PlayModes } from "./PlayModes";
import { PlaybackModes } from "./PlaybackModes";
import GeometricSlider from "./GeometricSlider";
import AdvancedRange from "./AdvancedRange"
import AdvancedSlider from "./AdvancedSlider"
import Utils from "./Utils";
import { InitPreset } from "./PresetsLib";

class ModePanel extends Component {
	state = {
		bpmStep: this.props.bpmStep,
		bpmRange: this.props.bpmRange,
		//bpmStableSlider={this.props.bpmStableSlider}
		currentBpm: this.props.bpmRange[0],
		playbackMode: this.props.playbackMode,
		playMode: this.props.playMode,
		// interval: this.props.interval ,
	
		// bpmStep: 10,
		bpmStepDropdownOpen: false,
		byTimeInterval: this.props.byTimeInterval,
		byBarInterval: this.props.byBarInterval,
		constantBpmSlider: 300
	}
	// constructor(props) {
	// 	super(props);
		
	// 	if (props.playMode === PlayModes.BY_BAR) {
	// 		this.state.byBarInterval = props.interval;
	// 	} else {
	// 		this.state.byTimeInterval = props.interval;
	// 	}
	// }

	onAfterChange() {
		console.log('ModePanel.onAfterChange')
		this.props.onChange()
	}

	onModeChange(newMode) {
		this.setState({ playMode: newMode, interval: newMode === PlayModes.BY_BAR ? this.state.byBarInterval : this.state.byTimeInterval }, this.onAfterChange);
		// this.setState({ playMode: newMode, interval: newMode === PlayModes.BY_BAR ? this.state.byBarInterval : this.state.byTimeInterval }, this.onAfterChange);
	}

	

	onBpmRangeChange(bpmRange) {
		console.log('<ModePanel>onBpmRangeChange(' + bpmRange[0] + ')')
		this.setState({ bpmRange: bpmRange }, this.onAfterChange);
	}

	onBpmSliderChange = (value) => {
		// console.log('onBpmSliderChange', value)
		this.setState({ constantBpmSlider: value }, this.onAfterChange);
	}

	onBpmStepChange() {
		this.setState(prevState => ({
			bpmStepDropdownOpen: !prevState.bpmStepDropdownOpen
		}));
	}

	onBpmStepSelect(value) {
		this.setState({ bpmStep: value }, this.onAfterChange);
	}

	getValue() {

		// console.log('getValue', this.state.playbackMode)

		const o = {
			playMode: this.state.playMode,
			playbackMode: this.state.playbackMode,
			interval:
				this.state.playMode === PlayModes.BY_BAR
					? this.state.byBarInterval
					: this.state.byTimeInterval,
			bpmStep: this.state.bpmStep,
			bpmRange: this.state.playMode !== PlayModes.CONSTANT ? this.state.bpmRange : this.props.bpmRange,//this.refs.bpmRange.getValue() : null,
			constantBpmSlider: this.state.constantBpmSlider
		};
		// debugger
		return o;
	}

	setValue(o) {
		console.log('ModePanel.setValue',o)
		const slider =
			o.playMode === PlayModes.BY_BAR
				? this.refs.byBarSlider
				: this.refs.byTimeSlider;
		slider.setValue(o.interval);

		this.refs.bpmRange.setState({ bounds: o.bpmRange })
		this.setState(
			{
				playMode: o.playMode,
				playbackMode: o.playbackMode || this.props.playbackMode,
				bpmStep: o.bpmStep,
				byBarInterval:
					o.playMode === PlayModes.BY_BAR
						? o.interval
						: this.state.byBarInterval,
				byTimeInterval:
					o.playMode === PlayModes.BY_TIME
						? o.interval
						: this.state.byTimeInterval,
				bpmRange: o.bpmRange,
				constantBpmSlider: o.constantBpmSlider || this.state.constantBpmSlider
			},
			this.onAfterChange
		);

	}

	onTimeIntervalChange(v) {
		this.setState({ byTimeInterval: v, interval: v }, this.onAfterChange);
	}

	onBarIntervalChange(v) {
		this.setState({ byBarInterval: v, interval: v}, this.onAfterChange);
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
		return Utils.formatTimeLong(time)
	}

	renderIncreaseBpmDropdown() {
		return (
			<>
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
					this.props.bpmRange[0],
					this.props.bpmRange[1]
				]}
				pushable={true}
				onAfterChange={(value) => this.onBpmRangeChange(value)}
			/>
		</div>);
	}

	render() {
		return (
			<SimplePanel className="ModePanel" title="Mode" width="300px">
				<h6>Increase speed</h6>
				<ButtonGroup size="sm">
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(PlayModes.BY_BAR)}
						active={this.state.playMode === PlayModes.BY_BAR}
					>
						By bar
					</Button>
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(PlayModes.BY_TIME)}
						active={this.state.playMode === PlayModes.BY_TIME}
					>
						By time
					</Button>
					<Button
						size="sm"
						outline
						color="light"
						onClick={() => this.onModeChange(PlayModes.CONSTANT)}
						active={this.state.playMode === PlayModes.CONSTANT}
					>
						Stable
					</Button>
				</ButtonGroup>

				<Collapse isOpen={this.state.playMode !== PlayModes.CONSTANT}>
					{/* {this.state.playMode !== playModes.STABLE ? this.renderSpeedRange() : ''} */}
					{this.renderSpeedRange()}
				</Collapse>


				<Collapse isOpen={this.state.playMode === PlayModes.BY_BAR}>

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
				<Collapse isOpen={this.state.playMode === PlayModes.BY_TIME}>

					<div>
						Increase speed every
						<GeometricSlider
							ref="byTimeSlider"
							defaultValue={this.state.byTimeInterval}
							badgeFormatter={Utils.formatTimeLong}
							markFormatter={Utils.formatTime}
							onChange={v => this.onTimeIntervalChange(v)}
							min={1}
							max={600}
							marksAt={[1, 2, 5, 10, 30, 60, 120, 240, 600]}
						/>
					</div>
				</Collapse>
				
				{this.state.playMode !== PlayModes.CONSTANT ? this.renderIncreaseBpmDropdown() : ''}
				<Collapse isOpen={this.state.playMode === PlayModes.CONSTANT}>
					<div>
						Choose bpm

						<AdvancedSlider
							ref="constantBpmSlider"
							included={false}
							min={10}
							max={600}
							marks={{ 30: '30', 100: '100', 200: '200', 300: '300', 400: '400', 500: '500', 600: '600' }}
							value={this.state.constantBpmSlider}
							onChange={this.onBpmSliderChange}
						/>
					</div>
				</Collapse>

			</SimplePanel>
		);
	}
}

export default ModePanel;

ModePanel.defaultProps = {
	playMode: InitPreset.playMode,
	playbackMode: InitPreset.playbackMode,
	interval: InitPreset.interval,
	bpmStep: InitPreset.bpmStep,
	bpmRange: InitPreset.bpmRange,
	byTimeInterval: InitPreset.byTimeInterval,
	byBarInterval: InitPreset.byBarInterval,
	//bpmStableSlider={this.props.bpmStableSlider}
	currentBpm: InitPreset.bpmRange[0],
	// defaultValue={{playMode: this.props.playMode, interval: this.props.interval, bpmStep: this.props.bpmStep}}
	// onAfterChange={() => this.onModePanelChanged()}
	onAfterChange: null

};
