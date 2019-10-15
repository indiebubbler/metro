import React, { Component } from "react";
import { accentTypesArr } from "./AccentTypes";
import Accent from "./Accent";

class BarManager extends Component {
	state = {
		bars: []
	};

	constructor(props) {
		super(props);
		this.state.bars = props.defaultValue;
	}

	setAccents(accents, beatsPerStep) {
		this.setState({ bars: accents }, this.props.onAfterChange);
	}

	handleCellClick(selected) {
		let newBars = [...this.state.bars];
		
		const type = newBars[selected];
		// set new type
		newBars[selected] = accentTypesArr[(type + 1) % 3];;
		
		this.setState({bars: newBars}, this.props.onAfterChange)
	}

	getAccents() {
		return this.state.bars;
	}

	setActive(idx) {
		// unselect previous element
		if (this.lastActiveAccent) {
			this.lastActiveAccent.toggleCurrent();
			this.lastActiveAccent = undefined
		}
		// select new 
		const el = this.refs["accent" + idx];

		// make sure it exits though
		if (el) {
			el.toggleCurrent();
			this.lastActiveAccent = el;
		}
	}
 
	render() {
		return (
			<>
				{this.state.bars.map((bar, idx) => (
					<Accent ref={"accent" + idx}
						key={"accent" + idx}
						type={bar}
						onClick={() => this.handleCellClick(idx)}
					/>
				))}
			</>
		);
	}
}

export default BarManager;
