import React, { Component } from "react";
import Slider from "rc-slider";
import { Badge } from "reactstrap";
// import {Container, Row, Col} from 'reactstrap'

class DiscreteSlider extends Component {

    state = {
        value: undefined
    }

    constructor(props) {

        super(props);

        this.state.value = this.props.marks.find(el => el.value === this.props.defaultValue).value;
        this.state.innerValue = this.props.marks.findIndex(el => el.value === this.props.defaultValue);
    }

    onSliderChange = (sliderValue) => {
        this.setState({ innerValue: sliderValue, value: this.props.marks[sliderValue].value})        
        this.props.onChange(this.props.marks[sliderValue].value)
    }

    setValue(v) {
        const innerValue = this.props.marks.findIndex(el => el.value === v);
        const value = this.props.marks.find(el => el.value === v).value;
        this.setState({value: value, innerValue: innerValue})
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
                        // defaultValue={this.findValueByKey(this.props.marks[this.props.defaultValue])}
                        value={this.state.innerValue}
                        style={{ height: '3.5em' }}
                        onChange={this.onSliderChange}
                        // onAfterChange={this.onAfterChange}
                        min={0}
                        max={this.props.marks.length - 1}
                        step={1}
                        marks={this.props.marks} />
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