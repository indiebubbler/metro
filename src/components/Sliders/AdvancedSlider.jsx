import React from "react";
import Slider from "rc-slider";
import { Badge, Button } from "reactstrap";
// import {Container, Row, Col} from 'reactstrap'

class AdvancedSlider extends Slider {

	constructor(props) {
		super(props)

		this.state.btnStep = props.btnStep || 1;
	}
	onMinusClick = () => {
		const newValue = this.state.value - this.state.btnStep;
		this.setState({value: newValue}, this.props.onChange(newValue))
	}

	onPlusClick = () => {
		const newValue = this.state.value + this.state.btnStep;
		this.setState({value: newValue}, this.props.onChange(newValue))
	}
	render() {
		return (
			<>
				<div className="advancedSlider">
					<Button size="sm" outline className="inlineBtn" onClick={this.onMinusClick}>-</Button>
					<Badge
						color="light"
						className="d-i"
					>
						{this.state.value}
						{/* {this.props.badgeFormatter(this.state.value)} */}
					</Badge>
					<Button size="sm" outline className="inlineBtn" onClick={this.onPlusClick}>+</Button>
				</div>
				<div style={{ height: "30px" }}>
					<div>{super.render()}</div>
				</div>
			</>
		);
	}

	onBadgeClick() {
		// TODO attach editorInPlace
	}
}

export default AdvancedSlider;
