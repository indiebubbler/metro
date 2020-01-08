import React, { Component } from "react";
import { accentColor } from "../AccentTypes";


class TrackRow extends Component {

    state = {
        activeIdx : null
    }

    activeColor = 'rgb(255, 121, 121)';

    setActive(idx) {
        this.setState({activeIdx: idx})
    }

    render() {
        return (
            <div className="trackRow">
                <div className="label">
                    <span>{this.props.sample.label}</span>
                </div>
                {
                    this.props.trackRow.map((el, idx) => {

                        const style = {}
                        if (this.props.trackRow[idx]) {
                            style.backgroundColor = accentColor[this.props.sample.idx] 
                        }
                        if (this.state.activeIdx === idx) {
                            style.borderColor = this.activeColor;
                        }
                        return (
                            <div
                                key={"cell_" + idx}
                                className="clickable cell"
                                style={style}
                                onClick={() => this.props.onClick(this.props.sample.idx, idx)} />
                        )
                    })
                }
            </div>
        )
    }
}

export default TrackRow;

TrackRow.defaultProps = {
}

