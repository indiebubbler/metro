import React from "react";
import { Range } from "rc-slider";
import { Badge } from "reactstrap";
import RangeEditInPlace from "./RangeEditInPlace";

class AdvancedRange extends Range {
	onBadgeClick() {
		this.refs.editor.open();
	}

	onEdit(v) {
		this.setState({ bounds: [v.min, v.max] }, () => this.props.onAfterChange(this.state.bounds))

	}
	render() {
		return (
			<>
				<div>
					<Badge
						color="light"
						onClick={this.props.editInPlace ? () => this.onBadgeClick() : function () { }}
						className={this.props.editInPlace ? "clickable" : ''}
					>
						{this.state.bounds[0]} - {this.state.bounds[1]}
					</Badge>
					<RangeEditInPlace
						ref={"editor"}
						title={this.props.title}
						value={{ min: this.state.bounds[0], max: this.state.bounds[1] }}
						min={this.props.min}
						max={this.props.max}
						onChange={(v) => this.onEdit(v)} />
				</div>
				<div style={{ height: "30px" }}>
					{super.render()}
				</div>
			</>
		);
	}
}

export default AdvancedRange;

// inherit props from base class
AdvancedRange.defaultProps = Object.assign({}, Range.defaultProps, {
	editInPlace: false,
	title: ''
});