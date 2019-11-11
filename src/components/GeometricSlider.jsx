import React, { Component } from 'react';
import Slider from 'rc-slider'
import regression from 'regression';
import {Badge} from 'reactstrap'


class GeometricSlider extends Component {
	state = {
        value: undefined,
        regression: undefined
	};

    constructor(props) {
        // TOneverDo 
        // currently it works only for min=1 only
        super(props);
        
        const d = [[0,this.props.min],  [100, this.props.max]];
        
        this.state.regression = regression.exponential(d, {precision : 10 })
        // console.log('slider func', this.state.regression.string)

        this.prepareMarks();

        this.state.value = this.props.defaultValue;
        
    }

    prepareMarks() {
        this.marks = {};
        
        for (let i = 0; i < this.props.marksAt.length; i++) {
            this.marks[  this.findX(this.props.marksAt[i]) ]  = this.props.marksAt[i];
        }
    }

    makeMark(value) {
        return {
            label: this.props.markFormatter(
                Math.floor(value)
            ),
            style: this.props.marksStyle
        };
    }

    onChange(v) {
        console.log('onChange', v)
        const value =  Math.floor(this.state.regression.predict(v)[1]);
        this.setState({value: value})
        this.props.onChange(value)
    }
 
    findX(y) {
        // y = e^bx ==> x = ln(y) / b
        return Math.log(y)/this.state.regression.equation[1];
    }
    
    setValue(v) {
        this.setState({value: v})
    }

    render() {
        return(
            <>
            	<div>
					<Badge  color="light" onClick={this.onBadgeClick} className="d-i">
                        {this.props.badgeFormatter(this.state.value)}
					</Badge>
				</div>
                <Slider ref="slider" included={false} value={this.findX(this.state.value)} style={{height: '45px'}} onChange={(v) => this.onChange(v)} min={0} max={100} step={0.5} marks={this.marks}/>
            </>
        )

    }
    
}
 
export default GeometricSlider;

GeometricSlider.defaultProps = {
    marksNum: 6,
    marksStyle: {
        color: '#ccc'
    },
    desc: '',
    badgeFormatter: function(v) {return v;},
    markFormatter: function(v) {return v;},
    defaultValue: 50,
    marksAt: []
}