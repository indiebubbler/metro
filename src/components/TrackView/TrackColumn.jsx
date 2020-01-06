import React, { Component } from "react";
import { accentTypes, accentColor } from "../AccentTypes";
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
        this.setState({ isCurrent: !this.state.isCurrent })
    }

    // makeRow(instrument) {
    //     // debugger
    //     // return <div/>
    //     return <div className={"cell clickable"} key={"iRow" + instrument.idx} style={this.props.value.indexOf(instrument.idx) >= 0 ? {backgroundColor: accentColor[instrument.idx]} : {}} onClick={() => this.props.onClick(instrument.idx)}></div>
    // }

    componentWillUnmount() {
        // debugger;
    }

    render() {
        return (
            <div className={"el " + (this.state.isCurrent === true ? 'activeCol' : '')}>
                {/* <div className={"column " + (this.state.isCurrent === true ? 'activeCol' : '')}> */}

                {/* <div key={"label_" + idx} className="row leftM labelCol"><p className="label">{item.label}</p></div> */}




                {this.props.instrument.samples.map((sample) => {
                    return <div className={"elsub clickable"} key={"iRow" + sample.idx} style={this.props.value.indexOf(sample.idx) >= 0 ? { backgroundColor: accentColor[sample.idx] } : {}} onClick={() => this.props.onClick(sample.idx)}></div>
                    // return <div className={"cell clickable"} key={"iRow" + sample.idx} style={this.props.value.indexOf(sample.idx) >= 0 ? {backgroundColor: accentColor[sample.idx]} : {}} onClick={() => this.props.onClick(sample.idx)}></div>
                    // // this.makeRow(item)
                }
                )}
            </div>
        )
    }
}

export default TrackColumn;

TrackColumn.defaultProps = {
    value: []
}

