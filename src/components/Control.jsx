import React, { Component } from 'react'
import ModePanel from './ModePanel'
import PlaybackPanel from './PlaybackPanel'
import { Row, Col } from "reactstrap";
import PresetsManager from './PresetsManager'
class Control extends Component {
    state = {}

    getValue() {

        const s1 = this.refs.modePanel.state
        const s2 = this.refs.playbackPanel.state;
        const state = { ...s1, ...s2 };
        // console.log('Control get value:', state)
        return state;
    }
    onChange() {
        const value = this.getValue();
        console.log('Control.onChange', value)
        // debugger
        this.props.onChange(value)

    }

    setActiveBeat(idx) {
        this.refs.playbackPanel.setActiveBeat(idx)
    }

    onPresetSelect(preset) {
        this.refs.modePanel.setValue(preset)
        this.refs.playbackPanel.setValue(preset);
        this.props.onPresetSelect(preset)
    }

    render() {
        return (
            <><Row>
                <Col>
                    <ModePanel
                        ref="modePanel"
                        onChange={() => this.onChange()}
                    />
                </Col>
            </Row>
                <Row>
                    <Col>
                        <PlaybackPanel ref='playbackPanel' onChange={() => this.onChange()} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PresetsManager
                            ref="presetsManager"
                            cookies={this.props.cookies}
                            // presets={PresetsLib}
                            getPreset={() => this.getUiState()}
                            onSelect={preset => this.onPresetSelect(preset)}
                        />

                    </Col>
                </Row>
            </>);
    }
}

export default Control;

Control.defaultProps = {
    onChange: function (value) { }
}