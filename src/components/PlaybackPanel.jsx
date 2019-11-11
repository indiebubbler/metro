import React, { Component } from 'react'
import BarManager from './BarManager'
import { Container, Row, Col } from "reactstrap";
import { accentTypes } from './AccentTypes'
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import AdvancedSlider from "./AdvancedSlider";
import { InitPreset } from './PresetsLib';
import { InstrumentsArray } from './Instruments'

class PlaybackPanel extends Component {
    state = {
        // beatsPerStep: this.props.beatsPerStep,
        instrument: this.props.instrument.key,
        accents: this.props.accents//,
        // instrumentDropdownLabel: this.props.instrument.label    // TODO: support old instrument without key/label
    }

    setValue(config) {
        debugger;

        this.refs.beatsPerStep.setState({ value: config.beatsPerStep });
            // this.refs.sm.setBeatsPerStep(preset.beatsPerStep);
         this.onInstrumentSelect(config.instrument);
        //     this.refs.sm.setInstrument(preset.instrument)
        this.refs.barManager.setAccents(config.accents, config.beatsPerStep);
    
    }

    getAccents() {
        return this.refs.barManager.getAccents()
    }


    onAccentsChange() {
        const accents = this.refs.barManager.state.bars
        this.setState({ accents: accents }, this.props.onChange);
        // this.props.onChange()
        // this.props.sm.setAccents(accents)
    }


    setActiveBeat(idx) {
        this.refs.barManager.setActive(idx)
    }

    onBeatsPerStepChange = () => {
        // plan doesn't change here, just the beats per step amount
        const newBps = this.refs.beatsPerStep.getValue();

        let accents = this.refs.barManager.getAccents();
        while (accents.length > newBps) {
            accents.pop();
        }
        while (accents.length < newBps) {
            accents.push(accentTypes.ACCENT_2);
        }

        // this.refs.sm.setBeatsPerStep(newBps);
        this.refs.barManager.setAccents(accents);
        this.setState({ beatsPerStep: newBps, accents: accents });
        this.props.onChange();
        //
        // this.props.sm.setBeatsPerStep(newBps);

    }

    render() {
        return (
            <Container className="pane" >
                <Row className="pane-title">PLAYBACK</Row>
                <Row className="pane-body">
                    

                    <Row>
                        <Col xs={3}>Beats per step</Col>
                        <Col>
                            <AdvancedSlider
                                ref="beatsPerStep"
                                min={2}
                                max={16}
                                defaultValue={this.props.beatsPerStep}
                                onAfterChange={this.onBeatsPerStepChange}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={3}>Accents</Col>
                        <Col>
                            <BarManager
                                onAfterChange={() => this.onAccentsChange()}
                                ref="barManager"
                                defaultValue={this.props.accents}
                            />
                        </Col>
                    </Row>
                </Row>
            </Container>
        );
    }
}

export default PlaybackPanel;

PlaybackPanel.defaultProps = {
    // onAccentsChange: function(accents) {},
    beatsPerStep: InitPreset.accents.length,
    instrument: InitPreset.instrument,
    accents: InitPreset.accents
}
