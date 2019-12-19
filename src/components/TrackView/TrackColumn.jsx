import React, { Component } from "react";
import { accentTypes, accentColor} from "../AccentTypes";
import { Col, Row } from 'reactstrap'

class TrackColumn extends Component {
    // activeStyles = {
    //     [accentType.UP]: {
    //         backgroundColoraccentColor.UP, 
    //     [accentType.MID]: accentColor.MID, 
    //     [accentType.DOWN]: accentColor.DOWN, 
    // }
    
    state = {
        isCurrent: false
	};

    getActiveStyle(accentType) {
        return {
            backgroundColor: accentColor[accentType]
        }
    }
    
    toggleCurrent() {
		this.setState({isCurrent: !this.state.isCurrent})
    }

    makeRow(instrument) {
        // debugger
        // return <div/>
        return <div className={"row clickable"} key={"iRow" + instrument.idx} style={this.props.value.indexOf(instrument.idx) >= 0 ? {backgroundColor: accentColor[instrument.idx]} : {}} onClick={() => this.props.onClick(instrument.idx)}></div>
    }

    render() {
        return (
            <div className={"column " + (this.state.isCurrent === true ? 'activeCol' : '')}>
                {this.props.instrument.samples.map((item) => this.makeRow(item))}
                {/* {this.makeRow(accentTypes.UP)}
                {this.makeRow(accentTypes.MIDDLE)}
                {this.makeRow(accentTypes.DOWN)} */}
                {/* <div className={"row "  (this.props.value.indexOf(accentTypes.UP) > -1 ? 1 : 0)} onClick={() => this.props.onClick(accentTypes.UP)} >x</div>
                <div className={"row " + (this.props.value.indexOf(accentTypes.MIDDLE) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.MIDDLE)} >x</div>
                <div className={"row " + (this.props.value.indexOf(accentTypes.DOWN) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.DOWN)} >x</div> */}
            </div>
        )
    }
    // render_old() {
    //     return (
    //         <div className={"column " + (this.state.isCurrent === true ? 'activeCol' : '')}>
    //             {this.makeRow(accentTypes.UP)}
    //             {this.makeRow(accentTypes.MIDDLE)}
    //             {this.makeRow(accentTypes.DOWN)}
    //             {/* <div className={"row "  (this.props.value.indexOf(accentTypes.UP) > -1 ? 1 : 0)} onClick={() => this.props.onClick(accentTypes.UP)} >x</div>
    //             <div className={"row " + (this.props.value.indexOf(accentTypes.MIDDLE) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.MIDDLE)} >x</div>
    //             <div className={"row " + (this.props.value.indexOf(accentTypes.DOWN) > -1 ? "active" : "")} onClick={() => this.props.onClick(accentTypes.DOWN)} >x</div> */}
    //         </div>
    //     )
    // };
}

export default TrackColumn;

TrackColumn.defaultProps = {
    value: []
}

