import React from "react";
import Slider from "rc-slider";
import { Badge  } from "reactstrap";
// import {Container, Row, Col} from 'reactstrap'

class AdvancedSlider extends Slider {
	render() {
		return (
			<>
				<div>
					<Badge
						color="light"
						// onClick={this.onBadgeClick}
						className="d-i"
					>
						{this.state.value}
					</Badge>
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

