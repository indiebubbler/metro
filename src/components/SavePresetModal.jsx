import React, { Component } from "react";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

class SavePresetModal extends Component {
	state = {
		modal: false,
		preset: null
	};

	constructor(props) {
		super(props);

		this.state = {
			modal: false
		  };
	  
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState(prevState => ({
		  modal: !prevState.modal
		}));
	  }
	
	handleSave() {
		const title = this.state.title;
		const preset = this.props.preset;
		if (title && title.length > 0) {
			this.props.onSave(title, preset);
			this.toggle();
		}
	}

	editPreset(preset) {

	}
	
	render() {
		return (
			<>
				<Button  size="sm" variant="primary" onClick={this.toggle}>
					Save Preset
				</Button>
				<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
				<ModalHeader toggle={this.toggle}>Save Preset</ModalHeader>
				<ModalBody>
					<Input onChange={e => this.setState({title: e.target.value})} value={(this.props.preset && this.props.preset.title) || ''}/>
					{/* <div>{JSON.stringify(this.props.preset)}</div> */}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => this.handleSave()}>Save</Button>{' '}
					<Button color="secondary" onClick={this.toggle}>Cancel</Button>
				</ModalFooter>
				</Modal>
			</>
		);
	}
}

export default SavePresetModal;
