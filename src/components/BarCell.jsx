import React, { Component } from 'react';
import { Button} from 'reactstrap'

/* IT IS NOT USED
class BarCell extends Component {
    state = {
        isAccent: false,
        pos: -1
    }

    constructor(props) {
        super(props);
        this.state.pos = props.pos
    }

    handleBarClick() {
        this.setState({isAccent: !this.state.isAccent})
        this.onClick()
    }
    render() { 
        var clsName = ' badge m-1 badge-info ';
        if (this.state.isAccent === true) {
            clsName += 'active'
        }
        return <Button key={this.props.pos} className={clsName}>X</Button>
        // return <Col onClick={() => this.handleBarClick()} key={"bars"} xs="xs"><Button className='{clsName} badge m-1 badge-info' style={{cursor: 'pointer'}}>X</div></Col>
    }
}
export default BarCell*/