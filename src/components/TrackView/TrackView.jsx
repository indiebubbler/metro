import React, { Component } from "react";
import TrackColumn from './TrackColumn'
import { accentTypes } from "../AccentTypes";
import SimplePanel from "../SimplePanel";
import { Container, Row, Col } from 'reactstrap'
import { InitPreset } from "../PresetsLib";

class TrackView extends Component {
    state = {
        track: this.props.track
    }

    getValue() {
        return this.state.track
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
        this.setState({track: track}, this.props.onChange)
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
            this.setState({track: track}, this.props.onChange)
        }
    }

    removeBeat() {
        if (this.state.track.length > 1) {
            let track = [...this.state.track];
            track.splice(track.length -1, 1);
            this.setState({track: track}, this.props.onChange)
        }
    }
    render() {
        
        return (
            <>
                <div className="trackview">
                    <Row>
                        {
                            this.state.track.map((item,idx) => {
                                return <TrackColumn ref={"col" + idx} value={item} onClick={(accentType) => this.handleColumnClick(accentType, idx)} />
                            })
                        }
                        <div className="column">
                            <div className="row" onClick={() => this.addBeat()}>+</div>
                            <div className="row" onClick={() => this.removeBeat()}>-</div>
                        </div>
                    </Row>
                </div>
            </>
        )
    }
}

export default TrackView;

TrackView.defaultProps = {
    track: InitPreset.track
}

