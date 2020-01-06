import React, { Component } from "react";
import { accentTypes, accentColor } from "../AccentTypes";
import { Col, Row } from 'reactstrap'

class TrackRow extends Component {

    state = {
        activeIdx : null
    }

    activeColor = 'rgb(255, 121, 121)';

    setActive(idx) {
        // this.activeIdx = idx
        this.setState({activeIdx: idx})
    }

    render() {
        return (
            <div className="trackRow">
                <div className="label">
                    <span>{this.props.sample.label}</span>
                </div>
                {
                    this.props.trackRow.map((el, idx) => {

                        const style = {}
                        if (this.props.trackRow[idx]) {
                            style.backgroundColor = accentColor[this.props.sample.idx] 
                        }
                        if (this.state.activeIdx === idx) {
                            style.borderColor = this.activeColor;
                        }
                        //     this.props.trackRow[idx] === true ?: {}
                        // }

                        return (
                            <div
                                key={"cell_" + idx}
                                className="clickable cell"
                                style={style}
                                onClick={() => this.props.onClick(this.props.sample.idx, idx)} />
                        )
                    })
                }


                {/* <div className={"column " + (this.state.isCurrent === true ? 'activeCol' : '')}> */}

                {/* <div key={"label_" + idx} className="row leftM labelCol"><p className="label">{item.label}</p></div> */}




                {/* {this.props.instrument.samples.map((sample) => {
                    return <div className={"elsub clickable"} key={"iRow" + sample.idx} style={this.props.value.indexOf(sample.idx) >= 0 ? { backgroundColor: accentColor[sample.idx] } : {}} onClick={() => this.props.onClick(sample.idx)}></div>
                    // return <div className={"cell clickable"} key={"iRow" + sample.idx} style={this.props.value.indexOf(sample.idx) >= 0 ? {backgroundColor: accentColor[sample.idx]} : {}} onClick={() => this.props.onClick(sample.idx)}></div>
                    // // this.makeRow(item)
                }
                )} */}
            </div>
        )
    }
}

export default TrackRow;

TrackRow.defaultProps = {
}

