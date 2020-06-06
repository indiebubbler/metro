import React, { Component } from "react";
import {
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert
} from "reactstrap";
import Tr from "./Locale"

class ImportDialog extends Component {
    state = {
        modal: false,
        showInvalidFileAlert: false
    };

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    open() {
        this.toggle();
    }

    close() {
        this.setState({modal: false, showInvalidFileAlert: false})
    }

    onPresetsLoaded(e) {
        try {
            let json = JSON.parse(e.target.result);
            this.setState({showInvalidFileAlert: false})
            this.props.onJsonReady(json);                
        }
        catch (e) {
            this.setState({showInvalidFileAlert: true})
        }
    }


    onUploadBtn(e) {
        var reader = new FileReader();
        reader.onload = (reader) => this.onPresetsLoaded(reader);
        reader.readAsText(e.target.files[0]);
    }

    render() {
        return (
            <>
                <Button
                    style={{ marginTop: '0.5em' }}
                    outline
                    size="sm"
                    color="light"
                    onClick={this.props.onImportBtn}
                >
                    {Tr("Import from file")}
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                >
                    <ModalHeader toggle={this.toggle}>{Tr("Import Presets")}</ModalHeader>
                    <ModalBody>
                        <Input type='file' onChange={(e) => this.onUploadBtn(e)} />
                        <Alert hidden={!this.state.showInvalidFileAlert} color="danger">
                            {Tr("I can't read this file")}
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>
                            {Tr("Cancel")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}
export default ImportDialog;


ImportDialog.defaultProps = {
	onJsonReady: function () { }
};
