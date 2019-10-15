import React, { Component } from 'react';
import {Container, Row} from 'reactstrap'

class SimplePanel extends Component {
    render() { 
        return (
            <Container className={"pane " + this.props.className}>
				<Row className="pane-title">{this.props.title}</Row>
				<Row className="pane-body">{this.props.children}</Row>
            </Container>
            );
    }
}
 
export default SimplePanel;


SimplePanel.defaultProps = {
    title: 'title',
    children: [],
    className: ''
 };