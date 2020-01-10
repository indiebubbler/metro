import React, { Component } from "react";
import Tone from "tone";
import SimplePanel from "./SimplePanel";
import Tr from "./Locale";

class MixerPanel extends Component {

    render() {
        return (
            <SimplePanel title={Tr("Mixer")}>
                <div>Mixer</div>
            </SimplePanel>
        );
    }
}

export default MixerPanel;

