import React, { Component } from "react";
import TrackColumn from './TrackColumn'
import TrackRow from './TrackRow'
// import { accentTypes } from "../AccentTypes";
import { accentTypes, accentColor } from "../AccentTypes";
import SimplePanel from "../SimplePanel";
import {Badge, Button, ButtonGroup } from 'reactstrap'
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
            if (ref.current)
                ref.current.setActive(idx);
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
            // this.setState({ track: track }, this.props.onChange)
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
            this.rowRefs.push(React.createRef())
        })

        // let refaa=React.createRef();
        return (

            <SimplePanel style={{ padding: '15px' }} title={Tr("Sequencer")}>
                <div className="trackview">
                    <div className="trackContainer">
                        {
                            this.props.instrument.samples.map(sample => {
                                return <TrackRow ref={this.rowRefs[sample.idx]} key={"trackRow_" + sample.idx} sample={sample} trackRow={this.filterTrack(sample.idx)} onClick={(sampleIdx, trackIdx) => this.handleColumnClick(sampleIdx, trackIdx)} />
                            })
                        }

                        {/* <TrackRow label={this.props.instrument.samples[1].label} track={this.filterTrack(1)} />
                        <TrackRow label={this.props.instrument.samples[2].label} track={this.filterTrack(2)} /> */}
                        {
                            // this.props.track.find(item => item.idx === 1).map((item, idx) => {
                            //     return <TrackColumn ref={"col" + idx} key={"tCol" + idx} instrument={this.props.instrument} value={item} onClick={(accentType) => this.handleColumnClick(accentType, idx)} />
                            // })
                        }
                    </div>
                    <div className="btnContainer">
                        <ButtonGroup size="sm" vertical>
                        <Button onClick={() => this.addBeat()}>+</Button>
                        <Button onClick={() => this.removeBeat()}>-</Button>
                        <h3><Badge  color="dark">{this.props.track.length}</Badge></h3>
                        </ButtonGroup>
                        

                        
                    </div>


                </div>
            </SimplePanel>
        )
    }


    // ___render() {
    //     if (this.props.instrument === undefined) {
    //         return <div>No instrument loaded</div>
    //     }
    //     return (

    //         <SimplePanel style={{ padding: '15px' }} title={Tr("Sequencer")}>
    //             <div className="trackview">
    //                 <div className="container">
    //                     {/* {this.props.instrument.samples.map(function (item, idx) {
    //                         return <div key={"label_" + idx} className="row leftM labelCol"><p className="label">{item.label}</p></div>
    //                         })
    //                     } */}


    //                     {/* labels */}

    //                     <div className={"el"}>
    //                         {this.props.instrument.samples.map((sample) => {
    //                             return <div className={"elsub"} key={"iRow" + sample.idx} >label</div>
    //                             // return <div className={"cell clickable"} key={"iRow" + sample.idx} style={this.props.value.indexOf(sample.idx) >= 0 ? {backgroundColor: accentColor[sample.idx]} : {}} onClick={() => this.props.onClick(sample.idx)}></div>
    //                             // // this.makeRow(item)
    //                         }
    //                         )}
    //                     </div>

    //                     {/* beats */}


    //                     {
    //                         this.props.track.map((item, idx) => {
    //                             return <TrackColumn ref={"col" + idx} key={"tCol" + idx} instrument={this.props.instrument} value={item} onClick={(accentType) => this.handleColumnClick(accentType, idx)} />
    //                         })
    //                     }
    //                 </div>
    //                 {/* <Row> */}
    //                 {/* <div className="column">
    //                         {this.props.instrument.samples.map(function (item, idx) {
    //                             return <div key={"label_" +idx} className="row leftM labelCol"><p className="label">{item.label}</p></div>
    //                         })
    //                         }
    //                         {/* <div className="row leftM ">{this.props.instrument.samples[1].label}</div> */}
    //                 {/* <div className="row leftD ">{this.props.instrument.samples[2].label}</div> */}
    //                 {/* </div> */}
    //                 {/* {
    //                         this.props.track.map((item, idx) => {
    //                             return <TrackColumn ref={"col" + idx} key={"tCol" + idx} instrument={this.props.instrument} value={item} onClick={(accentType) => this.handleColumnClick(accentType, idx)} />
    //                         })
    //                     } */}
    //                 {/* <div className="column">
    //                         <div className="row clickable" onClick={() => this.addBeat()}>+</div>
    //                         <div className="row clickable" onClick={() => this.removeBeat()}>-</div>
    //                     </div> */}
    //                 {/* </Row> */}
    //             </div>
    //         </SimplePanel>
    //     )
    // }
}

export default TrackView;

TrackView.defaultProps = {
    track: InitPreset.track
}

