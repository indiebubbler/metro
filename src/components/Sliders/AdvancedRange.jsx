import React from "react";
import { Range } from "rc-slider";
import { Badge } from "reactstrap";

class AdvancedRange extends Range {
	render() {
		return (
			<>
				<div>
					<Badge
						color="light"
						// onClick={this.onBadgeClick}
						className="d-i"
					>
						{this.state.bounds[0]} - {this.state.bounds[1]}
					</Badge>
				</div>
                <div style={{ height: "30px" }}>
                {super.render()}
                </div>
			</>
		);
	}
}

export default AdvancedRange;
