import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge } from "reactstrap";

class DiscreteSlider extends Component {

    state = {
        value: undefined
    }

    constructor(props) {

        super(props);

        // set defaultValue
        this.state.value = this.props.marks[this.props.defaultValue].value;
        
        // find the index of defaultValue and set that on our innerSlider
        this.state.innerValue = Object.keys(this.props.marks).indexOf(this.props.defaultValue + '');

        // helpful to display marks properly (need to be an object)
        this.state.innerMarks = {};
        Object.values(this.props.marks).map((el, idx)  => {
            this.state.innerMarks[idx] = {label: el.label};
            return true;
        })
    }

    onSliderChange(sliderValue) {
        const value = Object.values(this.props.marks)[sliderValue].value;
        this.setState({ innerValue: sliderValue, value: value })
        this.props.onChange(value)
    }

    setValue(v) {
        // find index of new value
        const innerValue = Object.keys(this.props.marks).indexOf(v+'');//this.props.marks.findIndex(el => el.value === v);
        this.setState({ value: v, innerValue: innerValue })
    }

    render() {
        return (
            <>
                <div>
                    <Badge
                        color="light"
                        className="d-i"
                    >
                        {this.props.badgeFormatter(this.state.value)}
                    </Badge>
                </div>
                {/* render it slightly narrower so we fit marks which usually falls outside the container */}
                <div style={{ height: "3.5em", width: '95%', margin: 'auto', whiteSpace: 'nowrap' }}>
                    <Slider ref="slider"
                        included={false}
                        value={this.state.innerValue}
                        style={{ height: '3.5em' }}
                        onChange={(v) => this.onSliderChange(v)}
                        min={0}
                        max={Object.keys(this.props.marks).length - 1}
                        step={1}
                        marks={this.state.innerMarks} />
                </div>
            </>
        );
    }

}

export default DiscreteSlider;


DiscreteSlider.defaultProps = {
    badgeFormatter: function (v) { return v; },
    markFormatter: function (v) { return v; },
    defaultValue: 0
}