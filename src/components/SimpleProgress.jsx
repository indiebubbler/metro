import React, { Component } from 'react';
import {Container} from 'reactstrap';

class SimpleProgress extends Component {
    state = {  }
    render() { 
        return ( <Container className="SimpleProgress">
            <div className="bar" style={{width: this.props.value  + "%", display: 'block'}} />
        </Container> );
    }
}
 
export default SimpleProgress;