import React, { Component } from "react";
import {
    Input,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    InputGroup,
    InputGroupAddon,
} from "reactstrap";
import Tr from "./../Locale"

class EditInPlace extends Component {
    state = {
        modal: false,
        value: this.props.value
    };

    open() {
        this.setState({modal: true, value: this.props.value})
    }

    close() {
        this.setState({ modal: false })
    }

    onOk() {
        this.props.onChange(this.state.value)
        this.close();
    }

    onValueChange(e, v) {
        let val = Number(e.target.value);
        this.setState({ value: val })
    }

    render() {
        return (
            <>
                <Modal
                    isOpen={this.state.modal}
                    className={this.props.className}
                >
                    <ModalBody>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">{this.props.title}</InputGroupAddon>
                            <Input min={this.props.min} max={this.props.max} type="number" value={this.state.value} onChange={(e) => this.onValueChange(e)} step="1" />
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.onOk()}>
                            {Tr("OK")}
                        </Button>

                        <Button color="secondary" onClick={() => this.close()}>
                            {Tr("Cancel")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}
export default EditInPlace;


EditInPlace.defaultProps = {
    onChange: function () { },
    title: ''
};
