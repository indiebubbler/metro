import React, { Component } from "react";
import {
    Input,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    InputGroup,
    InputGroupAddon,
    Alert
} from "reactstrap";
import Tr from "../Locale"

class RangeEditInPlace extends Component {
    state = {
        modal: false,
        value: this.props.value,
        showInvalidRange: false
    };

    open() {
        this.setState({ modal: true, value: this.props.value, showInvalidRange: false })
    }

    close() {
        this.setState({ modal: false })
    }

    onOk() {
        if (this.state.value.min >= this.state.value.max) {
            this.setState({ showInvalidRange: true })
            return
        }
        this.props.onChange(this.state.value)
        this.close();

    }

    onMinValueChange(e) {
        let v = Number(e.target.value);

        let value = this.state.value;
        value.min = v;
        this.setState({ value: value })
    }

    onMaxValueChange(e) {
        let v = Number(e.target.value);

        let value = this.state.value;
        value.max = v;
        this.setState({ value: value })
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
                            <InputGroupAddon addonType="prepend">{Tr("From")}</InputGroupAddon>
                            <Input min={this.props.min} max={this.props.max} type="number" value={this.state.value.min} onChange={(e) => this.onMinValueChange(e)} step="1" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">{Tr("To")}</InputGroupAddon>
                            <Input min={this.props.min} max={this.props.max} type="number" value={this.state.value.max} onChange={(e) => this.onMaxValueChange(e)} step="1" />
                        </InputGroup>
                        <Alert hidden={!this.state.showInvalidRange} color="danger">
                            {Tr("Invalid range!")}
                        </Alert>
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
export default RangeEditInPlace;

RangeEditInPlace.defaultProps = {
    onChange: function () { },
    title: ''
};
