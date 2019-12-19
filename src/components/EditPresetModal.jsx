import React, { Component } from "react";
import {
	Input,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from "reactstrap";
import Tr from "./Locale"

class EditPresetModal extends Component {
	state = {
		modal: false,
		preset: null,
		showDelete: false
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
		const preset = this.state.preset;
		const title = this.state.preset.title;
		if (title && title.length > 0) {
			this.props.onSave(title, preset);
			this.toggle();
		}
	}

	edit(preset, showDelete) {
		this.setState(
			{
				preset: preset,
				showDelete: showDelete
			},
			this.toggle
		);
	}

	titleChanged(e) {
		const newTitle = e.target.value;
		let preset = { ...this.state.preset };
		preset.title = newTitle;
		this.setState({ preset });
		// this.setState()
		// this.setState({title: e.target.value}
	}

	onDeleteBtn() {
		this.props.onDeleteBtn(this.state.preset);
		this.toggle();
	}

	renderDelete() {
		 
		if (this.state.showDelete === true) {
			return(<Button color="warning" onClick={() => this.onDeleteBtn()}>
				Delete
				</Button>
			);
		}
		
	}

	render() {
		return (
			<>
				<Button
					style={{marginTop: '0.5em'}}
					outline
					size="sm"
					color="light"
					onClick={this.props.onSaveBtn}
				>
					{Tr("Save current settings")}
				</Button>
				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}
					className={this.props.className}
				>
					<ModalHeader toggle={this.toggle}>Save Preset</ModalHeader>
					<ModalBody>
						<Input
							onChange={e => this.titleChanged(e)}
							defaultValue={
								(this.state.preset &&
									this.state.preset.title) ||
								""
							}
						/>
						<div className="code">
							{JSON.stringify(this.state.preset)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							onClick={() => this.handleSave()}
						>
							Save
						</Button>{" "}
						<Button color="secondary" onClick={this.toggle}>
							Cancel
						</Button>
						{this.renderDelete()}
					</ModalFooter>
				</Modal>
			</>
		);
	}
}

export default EditPresetModal;


EditPresetModal.defaultProps = {
	onDeleteBtn: function(preset) {},
	onSave: function(title, preset) {},
	onSaveBtn: function(e, idx) {}
 };
