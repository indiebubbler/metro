import React, { Component } from 'react'
// import BarManager from './BarManager'
import { Container, Row, Col } from "reactstrap";
import { accentTypes } from './AccentTypes'
import AdvancedSlider from "./AdvancedSlider";
import { InitPreset } from './PresetsLib';
import TrackView from './TrackView/TrackView'

class PlaybackPanel extends Component {
    state = {
        // accents: this.props.accents,    // TODO: this is obsolete
        track: this.props.track
    }

    setValue(config) {

        // this.refs.beatsPerStep.setState({ value: config.beatsPerStep });
        this.refs.trackView.setValue(config.track)
        // this.refs.barManager.setAccents(config.tracks, config.beatsPerStep);
        

    }

    // getAccents() {
    //     // return this.refs.barManager.getAccents()
    // }


    onAccentsChange() {

        // const accents = this.refs.barManager.state.bars
        const track = this.refs.trackView.state.track;
        
        this.setState({ track: track }, this.props.onChange);
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
            accents.push(accentTypes.DOWN);
        }

        this.refs.barManager.setAccents(accents);
        this.setState({ beatsPerStep: newBps, accents: accents });
    }

    render() {
        return (
            <Container className="pane" >
                <Row className="pane-title">PLAYBACK</Row>
                <Row className="pane-body">
                    <Row>
                        <Col xs={4}>Beats per step</Col>
                        <Col>
                            <AdvancedSlider
                                ref="beatsPerStep"
                                min={2}
                                max={16}
                                defaultValue={this.props.accents.length}
                                onAfterChange={this.onBeatsPerStepChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            TrackView
						    <TrackView ref='trackView' value={this.props.track} onChange={() => this.onAccentsChange()} />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col xs={4}>Accents</Col>
                        <Col>
                            <BarManager
                                onAfterChange={() => this.onAccentsChange()}
                                ref="barManager"
                                defaultValue={this.props.accents}
                            />
                        </Col>
                    </Row> */}
                </Row>
            </Container>
        );
    }
}

export default PlaybackPanel;

PlaybackPanel.defaultProps = {
    // onAccentsChange: function(accents) {},
    // beatsPerStep: InitPreset.accents.length,
    // instrument: InitPreset.instrument,
    // accents: InitPreset.accents,
    track: InitPreset.track
}
