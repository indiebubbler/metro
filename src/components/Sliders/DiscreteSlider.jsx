import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge } from "reactstrap";

class DiscreteSlider extends Component {

    state = {
        value: undefined,
        innerValue: 0
    }

    constructor(props) {

        super(props);
        // helpful to display marks properly (need to be an object)
        this.state.innerMarks = {};
        Object.values(this.props.marks).map((el, idx)  => {
            this.state.innerMarks[idx] = {label: el.label};
            return true;
        })
    }

    componentDidUpdate(prevProps, prevState) {
        // TODO: apply this componentDidUpdate to remaining custom sliders
        var value = this.props.value;
        var theValue = value !== undefined ? value : prevState.value;
        var innerValue = Object.keys(this.props.marks).indexOf(theValue+ '');
        
        if ( innerValue !== prevState.innerValue) {
            this.setState({innerValue: innerValue, value: value});
        }
    }

    onSliderChange(sliderValue) {
        const value = Object.values(this.props.marks)[sliderValue].value;
        this.setState({ innerValue: sliderValue, value: value })
        this.props.onChange(value)
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