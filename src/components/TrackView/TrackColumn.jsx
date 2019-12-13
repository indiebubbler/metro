import React, { Component } from "react";
import { accentTypes } from "../AccentTypes";
import { Col, Row } from 'reactstrap'

class TrackColumn extends Component {
    state = {
		isCurrent: false
	};

    toggleCurrent() {
		this.setState({isCurrent: !this.state.isCurrent})
    }
    
    render() {
        return (
            <div className={"column " + (this.state.isCurrent === true ? 'activeCol' : '')}>
                <div className={"row " + (this.props.value.indexOf(accentTypes.UP) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.UP)} >x</div>
                <div className={"row " + (this.props.value.indexOf(accentTypes.MIDDLE) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.MIDDLE)} >x</div>
                <div className={"row " + (this.props.value.indexOf(accentTypes.DOWN) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.DOWN)} >x</div>
            </div>
        )
    };
}

export default TrackColumn;

TrackColumn.defaultProps = {
    value: []
}

