import React, { Component } from "react";
import TrackRow from './TrackRow'
import SimplePanel from "../SimplePanel";
import { Badge, Button, ButtonGroup } from 'reactstrap'
import { InitPreset } from "../PresetsLib";
import Tr from "../Locale"

class TrackView extends Component {
    state = {
        track: this.props.track
    }

    rowRefs = [];

    handleColumnClick(sampleIdx, columnIdx) {
        // copy array
        let track = [...this.props.track];
        let newColumn = [...this.props.track[columnIdx]];

        const idx = this.props.track[columnIdx].indexOf(sampleIdx);
        if (idx < 0) {
            // add
            newColumn.push(sampleIdx)
        }
        else {
            // remove
            newColumn.splice(idx, 1);
        }
        track[columnIdx] = newColumn
        this.props.onChange(track)
    }

    setActiveColumn(idx) {
        this.rowRefs.map((ref) => {
            if (ref.current) {
                ref.current.setActive(idx);
            }
            return true;
        })
    }

    addBeat() {
        if (this.props.track.length < 24) {
            let track = [...this.props.track]
            // add empty beat
            track.push([]);
            this.props.onChange(track, true)
        }
    }

    removeBeat() {
        if (this.props.track.length > 1) {
            let track = [...this.props.track];
            track.splice(track.length - 1, 1);
            this.props.onChange(track, true)
        }
    }

    filterTrack(sampleIdx) {
        return this.props.track.map(item => {
            return item.indexOf(sampleIdx) >= 0;
        })
    }

    render() {
        if (this.props.instrument === undefined) {
            return <div>No instrument loaded</div>
        }

        this.props.instrument.samples.map(sample => {
            this.rowRefs.push(React.createRef());
            return true;
        })

        return (

            <SimplePanel style={{ padding: '15px' }} title={Tr("Sequencer")}>
                <div className="trackview">
                    <div className="trackContainer">
                        {
                            this.props.instrument.samples.map(sample => {
                                return <TrackRow ref={this.rowRefs[sample.idx]} key={"trackRow_" + sample.idx} sample={sample} trackRow={this.filterTrack(sample.idx)} onClick={(sampleIdx, trackIdx) => this.handleColumnClick(sampleIdx, trackIdx)} />
                            })
                        }
                    </div>
                    <div className="btnContainer">
                        <ButtonGroup size="sm" vertical>
                            <Button onClick={() => this.addBeat()}>+</Button>
                            <Button onClick={() => this.removeBeat()}>-</Button>
                            <h3><Badge color="dark">{this.props.track.length}</Badge></h3>
                        </ButtonGroup>
                    </div>


                </div>
            </SimplePanel>
        )
    }
}

export default TrackView;

TrackView.defaultProps = {
    track: InitPreset.track
}

