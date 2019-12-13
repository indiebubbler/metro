import React, { Component } from 'react'
import ModePanel from './ModePanel'
import PlaybackPanel from './PlaybackPanel'
import { Row, Col } from "reactstrap";

/* 
TODO 
THIS FILE IS DEPRECATED 

*/

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

    setValue(value) {
        this.refs.modePanel.setValue(value)
        this.refs.playbackPanel.setValue(value);
        this.onChange()
    }

    render() {
        return (
            <>
                <Col>
                    <ModePanel
                        ref="modePanel"
                        onChange={() => this.onChange()}
                    />
                </Col>
                <Col>
                    <PlaybackPanel ref='playbackPanel' onChange={() => this.onChange()} />
                </Col>

            </>
        );
    }
}

export default Control;

Control.defaultProps = {
    onChange: function (value) { }
}