import React, { Component } from "react";
import { Badge, ButtonGroup, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Samples, InstrumentsByKey } from '../Instruments'
import { InitPreset } from '../PresetsLib'
import Tr from './../Locale'
import Config from "../Config";
class TrackRow extends Component {

    state = {
        activeIdx: null,
        label: Tr("Please select")

        // instrument: null
    }

    componentDidMount() {
        // load initial sample defined in InitPreset
        if (!InitPreset.samples[this.props.idx]) {
            return
        }

        // TODO: I think I can find better place for this code. It's doing the job though and I'm lazy so...
        const instrument = InstrumentsByKey[InitPreset.samples[this.props.idx].instrumentKey];
        const file = InitPreset.samples[this.props.idx].file;
        this.onSampleSelect(instrument.key, file);
    }

    addBeat() {
        if (this.props.trackRow.length < Config.MAXIMUM_TIMESIGNATURE) {
            this.props.onMeasureChange(this.props.trackRow.length + 1)
        }
    }

    removeBeat() {
        if (this.props.trackRow.length > 1) {
            this.props.onMeasureChange(this.props.trackRow.length - 1)
        }
    }

    onSampleChange() {
        this.setState(prevState => ({
            sampleDropdownOpen: !prevState.sampleDropdownOpen
        }));

    }

    onSampleSelect(instrumentKey, filename) {
        this.props.soundLibrary.use(this.props.idx, instrumentKey, filename)
    }

    render() {
        return (
            <div className="trackRow">
                <div className="label">
                    <ButtonDropdown
                        isOpen={this.state.sampleDropdownOpen}
                        toggle={() => this.onSampleChange()}
                    >
                        <DropdownToggle
                            caret
                            size="sm"
                            outline
                            // className='w-100'
                            style={{ width: '6rem' }}
                            color="light"
                            ref="dropdown"
                        >
                            {this.props.soundLibrary.playersArr[this.props.idx] ? this.props.soundLibrary.playersArr[this.props.idx].fullLabel : Tr('Select')}
                            {/* {(this.props.instrument && this.props.instrument.file) || 'Please select'} */}
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                Samples.map((sample, idx) => {
                                    return (
                                        <DropdownItem key={'row_' + idx} onClick={() => this.onSampleSelect(sample.instrumentKey, sample.file)}>
                                            {InstrumentsByKey[sample.instrumentKey].label} - {sample.label}
                                        </DropdownItem>);
                                })
                            }
                        </DropdownMenu>
                    </ButtonDropdown>

                    <Badge color="outline" style={{ alignSelf: 'center', width: '1.2rem'}}>{ this.props.trackRow.length }</Badge>
                    {/* <Badge color="outline">{this.props.trackRow.length != this.props.timeSignature ? this.props.trackRow.length : ''}</Badge> */}
                    
                    <ButtonGroup size="xs" vertical>
                        <Button onClick={() => this.addBeat()}>+</Button>
                        <Button onClick={() => this.removeBeat()}>-</Button>
                    </ButtonGroup>
                </div>

                <div className="cells" ref="cellsDiv">
                    {/* <div className='indicator' style={{ left: this.props.progress + '%', position: 'relative' }}>|</div> */}
                    {
                        this.props.trackRow.map((el, idx) => {
                            const style = {}
                            if (this.props.trackRow[idx]) {
                                style.backgroundColor = Config.COLOR_PALETTE[this.props.idx]
                            }
                            return (
                                <div
                                    key={"cell_" + idx}
                                    className="clickable cell"
                                    style={style}
                                    onClick={() => this.props.onClick(this.props.idx, idx)} />
                            )
                        })
                    }
                </div>
            </div >
        )
    }
}

export default TrackRow;

TrackRow.defaultProps = {
}

