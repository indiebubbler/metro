import React, { Component } from "react";
import TrackRow from './TrackRow'
import SimplePanel from "../SimplePanel";
import { Badge, Button, ButtonGroup } from 'reactstrap'
import { InitPreset } from "../PresetsLib";
import Tr from "../Locale"
import Config from "../Config";

class TrackView extends Component {
    state = {
        // track: this.props.track,
        // trackInstruments: [],
        timeSignature: this.props.timeSignature
    }

    rowRefs = [];

    handleCellClick(sampleIdx, columnIdx) {
        // copy array
        let track = [...this.props.track];

        let v = track[sampleIdx][columnIdx];

        if (v > 0) {
            track[sampleIdx][columnIdx] = 0;
        }
        else {
            track[sampleIdx][columnIdx] = 1;
        }
        this.props.onChange(track, this.props.timeSignature);
    }

    setProgress(progress) {
        this.indicator.style.left = this.indicator.minLeft + progress * (this.indicator.maxRight - this.indicator.minLeft) + 'px'
    }

    updateDimensions() {
        // TODO: this is quite ugly
        const cellsBBtop = this.refs.trackRow_0.refs.cellsDiv.getBoundingClientRect();
        const cellsBBbottom = this.refs.trackRow_3.refs.cellsDiv.getBoundingClientRect();
        const box = { left: cellsBBtop.left, top: cellsBBtop.top, bottom: cellsBBbottom.bottom, right: cellsBBbottom.right };
        const indicator = this.refs.indicator;

        const left = this.refs.trackRow_0.refs.cellsDiv.offsetLeft;
        indicator.minLeft = this.refs.trackRow_0.refs.cellsDiv.offsetLeft;
        const right = left + this.refs.trackRow_0.refs.cellsDiv.offsetWidth;
        indicator.style.left = left + 'px'
        indicator.maxRight = right;

        indicator.style.height = box.bottom - box.top + 'px'
        this.indicator = indicator;


    }
    componentDidMount() {
        window.addEventListener('resize', () => this.updateDimensions());
        this.updateDimensions();
    }

    addBeat() {
        // add silent beat to each track, make sure we don't exceed max allowed timesignature

        if (this.props.timeSignature < Config.MAXIMUM_TIMESIGNATURE) {
            let track = [...this.props.track]

            for (let i = 0; i < track.length; i++) {
                if (track[i].length < Config.MAXIMUM_TIMESIGNATURE) {
                    track[i].push(0)
                }
            }
            this.props.onChange(track, this.props.timeSignature + 1)
        }
    }

    removeBeat() {
        // remove a beat from each track, making sure there won't be negative timeSignatures on any track

        if (this.props.timeSignature > 1) {
            let track = [...this.props.track];

            for (let i = 0; i < track.length; i++) {
                if (track[i].length > 1) {
                    track[i].pop()
                }
            }
            this.props.onChange(track, this.props.timeSignature - 1)

        }
    }

    onTrackRowSignatureChange(trackId, newTimeSignature) {

        if (newTimeSignature < 24) {
            let track = [...this.props.track]
            if (newTimeSignature > track[trackId].length) {
                // add silent beat
                track[trackId].push(0);

            }
            else {
                track[trackId].pop();
            }

            this.props.onChange(track, this.props.timeSignature)
        }
    }

    componentDidUpdate() {
        this.updateDimensions();
    }

    render() {

        let indicatorProgress = 0;
        if (this.indicator) {
            indicatorProgress = this.indicator.minLeft + this.props.partProgress * (this.indicator.maxRight - this.indicator.minLeft) + 'px';
        }

        return (
            <SimplePanel style={{ padding: '15px' }} title={Tr("Sequencer")}>
                <div className="trackView">
                    <div className="trackContainer">
                        <div className="indicator" ref='indicator' style={{ left: indicatorProgress }} />
                        {
                            // TODO: get rid of this hardcoded stuff
                            [0, 1, 2, 3].map(idx => {
                                return (
                                    <TrackRow
                                        idx={idx}
                                        ref={"trackRow_" + idx}
                                        soundLibrary={this.props.soundLibrary}//.use(idx, instrument, file);
                                        onMeasureChange={(newTimeSignature) => this.onTrackRowSignatureChange(idx, newTimeSignature)}
                                        key={"trackRow_" + idx}
                                        timeSignature={this.props.timeSignature}
                                        progress={this.props.progress}
                                        trackRow={this.props.track[idx]}
                                        onClick={(sampleIdx, trackIdx) => this.handleCellClick(sampleIdx, trackIdx)}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className="btnContainer">
                        <ButtonGroup size="sm" vertical>
                            <Button onClick={() => this.addBeat()}>+</Button>
                            <Button onClick={() => this.removeBeat()}>-</Button>
                        </ButtonGroup>
                        <div height="1em">
                            <Badge className="beatsCntBadge" color="dark">{this.props.timeSignature}</Badge>
                        </div>
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

