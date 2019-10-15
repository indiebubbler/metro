import React, { Component } from "react";

class Accent extends Component {
	state = {
		isCurrent: false
	};

	render() {
		return (
			<div className={"Accent " + (this.state.isCurrent === true ? "active" : "")}  onClick={this.props.onClick}>
				<div className={"type" + this.props.type}></div>
			</div>
		);
	}

	toggleCurrent() {
		this.setState({isCurrent: !this.state.isCurrent})
	}
}

export default Accent;
