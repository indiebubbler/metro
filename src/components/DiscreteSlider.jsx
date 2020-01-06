import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge } from "reactstrap";
// import {Container, Row, Col} from 'reactstrap'

class DiscreteSlider extends Component {

	state = {
		itemsCount: 0,
		marks: {},
		values: [],
		value: undefined
	}

	constructor(props) {

		super(props);

		// count how many elements we want to show
		let itemsCount = Object.keys(props.marks).length;

		const markInterval = 100 / (itemsCount - 1);

		let marks = {};
		let values = []
		let valLookup = {};
		for (let i = 0; i < itemsCount; i++) {
			const idx = i * markInterval;
			const val = Object.keys(props.marks)[i];

			marks[idx] = props.marks[val];
			values[props.marks[val]] = val;
			// valLookup[Object.keys(this.props.marks)[i]] = 
		}
		this.state.marks = marks
		this.state.values = values;

		// set initial value
		const val = this.state.values[this.state.marks[this.props.defaultValue]]
		const output = isNaN(val) ? val : Number(val);
		this.state.value = output;
	}

	// componentDidMount() {
	// 	// set initial value
	// 	// const val = this.state.values[this.props.defaultValue];
	// 	// debugger
	// 	console.log('did mount')
	// 	// this.onChange(this.getKeyByValue(this.state.marks, this.props.defaultValue))
	// 	// this.state.value = isNaN(val) ? val : Number(val)
	// }

	onChange(internalVal) {

		const val = this.state.values[this.state.marks[internalVal]]
		const output = isNaN(val) ? val : Number(val)
		this.setState({ value: output }, this.props.onChange(output))
	}

	getKeyByValue(object, value) {
		const el = Object.keys(object).find(key => object[key] === value);
		// debugger

		return el
	}

	setValue(seconds) {



	}

	findValueByKey(key) {
		return Number(this.getKeyByValue(this.state.marks, key));
	}

	render() {
		return (
			<>
				<div>
					<Badge
						color="light"
						// onClick={this.onBadgeClick}
						className="d-i"
					>
						{this.props.badgeFormatter(this.state.value)}
					</Badge>
				</div>
				<div style={{ height: "30px" }}>
					<Slider ref="slider" included={false}
						defaultValue={this.findValueByKey(this.props.marks[this.props.defaultValue])}
						style={{ height: '45px' }}
						onAfterChange={(v) => this.onChange(v)}
						min={0}
						max={100}
						step={null} marks={this.state.marks} />
				</div>
			</>
		);
	}

	onBadgeClick() {
		// TODO attach editorInPlace
	}
}

export default DiscreteSlider;


DiscreteSlider.defaultProps = {
	badgeFormatter: function (v) { return v; },
	markFormatter: function (v) { return v; },
	defaultValue: 0
}