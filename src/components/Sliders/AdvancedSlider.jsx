import React from "react";
import Slider from "rc-slider";
import { Badge, Button } from "reactstrap";
import EditInPlace from "./EditInPlace"

class AdvancedSlider extends Slider {

	constructor(props) {
		super(props)

		this.state.btnStep = props.btnStep || 1;
	}
	onMinusClick = () => {
		const newValue = this.state.value - this.state.btnStep;
		this.setState({ value: newValue }, this.props.onChange(newValue))
	}

	onPlusClick = () => {
		const newValue = this.state.value + this.state.btnStep;
		this.setState({ value: newValue }, this.props.onChange(newValue))
	}

	onEdit(value) {
		if (value >= this.props.min && value <= this.props.max) {
			this.setState({ value: value }, this.props.onChange(value));
		}
	}

	render() {
		return (
			<>
				<div className="advancedSlider">
					{this.props.disableBtns === true ? '' : <Button size="sm" outline className="inlineBtn" onClick={this.onMinusClick}>-</Button>}
					<Badge
						onClick={this.props.editInPlace ? (e) => this.onBadgeClick(e) : function(){}}
						color="light"
						className={this.props.editInPlace? "clickable" : ''}
					>
						{this.state.value}
						{/* {this.props.badgeFormatter(this.state.value)} */}
					</Badge>
					{this.props.editInPlace ? <EditInPlace ref={"editor"} title={this.props.title} value={this.state.value} min={this.props.min} max={this.props.max} onChange={(v) => this.onEdit(v)} /> : ''}
					{this.props.disableBtns === true ? '' : <Button size="sm" outline className="inlineBtn" onClick={this.onPlusClick}>+</Button>}
				</div>
				<div style={{ height: "30px" }}>
					<div>{super.render()}</div>
				</div>
			</>
		);
	}

	onBadgeClick(e) {
		if (this.refs.editor) {
			this.refs.editor.open();
		}
		// TODO attach editorInPlace
	}
}

export default AdvancedSlider;

// inherit props from base class
AdvancedSlider.defaultProps = Object.assign({}, Slider.defaultProps, {
	editInPlace: false,
	title: ''
});