import React, {Component} from 'react';
import {Container} from 'reactstrap'
class SimpleVis extends Component {
    state = { 
        radius: 50,
        height: 150
    }

    constructor(props)
    {
        super(props);
        this.myRef = React.createRef();
    }
    setActive(idx)  {
        if (this.lastEl) {
           this.lastEl.classList.remove('active')
        }

        // belts and braces 
        if (idx < this.props.beats) {
            let el = this.refs["el" + idx];
            el.classList.add('active')
            this.lastEl = el;
        }
    }

    componentDidUpdate() {
        // reposition elements
        const width = this.myRef.current.offsetWidth;

        let radDelta = 2*Math.PI / this.props.beats;

        for (let i = 0 ; i < this.props.beats ; i++) {
            let x =  this.state.radius * Math.sin(radDelta * i);
            let y =  -this.state.radius * Math.cos(radDelta * i);
     
  
            this.refs["el" + i].style.position = 'absolute';
            this.refs["el" + i].style.left =  - 20 + width/2 + x + 'px';  // hardcoded numbers determined visually
            this.refs["el" + i].style.top = 50 +  y + 'px';
        }   
    }

    renderCells(cell) {
        let o = [];
        for (let i = 0 ; i < this.props.beats ; i++) {
            o.push(<div ref={"el" + i}>{i+1}</div>);
        }
        return o
    }

    render() {  
        return (
        <Container>
            <div ref={this.myRef} className="SimpleVis" style={{ height: this.state.height}}>{this.renderCells()}</div>
        </Container>);
    }
}
 
export default SimpleVis; 

SimpleVis.defaultProps = {
    beats: 4
}
