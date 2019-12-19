import React, { Component } from "react";
import TrackColumn from './TrackColumn'
import { accentTypes } from "../AccentTypes";
import SimplePanel from "../SimplePanel";
import { Container, Row, Col } from 'reactstrap'
import { InitPreset } from "../PresetsLib";
import Tr from "../Locale"
class TrackView extends Component {
    state = {
        track: this.props.track
    }

    getValue() {
        return this.state.track
    }

    setValue(track) {
        this.setState({ track: track })

    }
    // constructor(props) {
    //     super(props)
    //     // this.setMeasure(props.measure)
    // }

    // componentDidMount() {
    //     // this.setMeasure(this.props.measure)
    // }

    // setMeasure(measure) {
    //     let columns = [];
    //     for (let i = 0; i < measure; i++) {
    //         columns.push(i);
    //     }

    //     this.setState({ columns: columns })
    // }

    handleColumnClick(accentType, columnIdx) {
        // copy array
        let track = [...this.state.track];
        let newColumn = [...this.state.track[columnIdx]];

        const idx = this.state.track[columnIdx].indexOf(accentType);
        if (idx < 0) {
            // add 
            newColumn.push(accentType)
        }
        else {
            // remove
            newColumn.splice(idx, 1);
        }
        track[columnIdx] = newColumn
        this.setState({ track: track }, this.props.onChange)
    }

    setActiveColumn(idx) {
        if (this.lastActiveCol) {
            this.lastActiveCol.toggleCurrent();
            this.lastActiveCol = undefined
        }
        // select new 
        const el = this.refs["col" + idx];

        // make sure it exits though
        if (el) {
            el.toggleCurrent();
            this.lastActiveCol = el;
        }
    }

    addBeat() {
        if (this.state.track.length < 24) {
            let track = [...this.state.track]
            track.push([0]);
            this.setState({ track: track }, this.props.onChange)
        }
    }

    removeBeat() {
        if (this.state.track.length > 1) {
            let track = [...this.state.track];
            track.splice(track.length - 1, 1);
            this.setState({ track: track }, this.props.onChange)
        }
    }
    render() {
        if (this.props.instrument === undefined) {
            return <div>No instrument loaded</div>
        }
        return (

            <SimplePanel style={{ padding: '15px' }} title={Tr("Sequencer")}>
                <div className="trackview">
                    <Row>
                        <div className="column">
                            {this.props.instrument.samples.map(function (item, idx) {
                                return <div key={"label_" +idx} className="row leftM labelCol">{item.label}</div>
                            })
                            }
                            {/* <div className="row leftM ">{this.props.instrument.samples[1].label}</div> */}
                            {/* <div className="row leftD ">{this.props.instrument.samples[2].label}</div> */}
                        </div>
                        {
                            this.state.track.map((item, idx) => {
                                return <TrackColumn ref={"col" + idx} key={"tCol" + idx} instrument={this.props.instrument} value={item} onClick={(accentType) => this.handleColumnClick(accentType, idx)} />
                            })
                        }
                        <div className="column">
                            <div className="row clickable" onClick={() => this.addBeat()}>+</div>
                            <div className="row clickable" onClick={() => this.removeBeat()}>-</div>
                        </div>
                    </Row>
                </div>
            </SimplePanel>
        )
    }
}

export default TrackView;

TrackView.defaultProps = {
    track: InitPreset.track
}

