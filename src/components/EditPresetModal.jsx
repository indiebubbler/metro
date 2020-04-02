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
		nestedModal: false,
		preset: null,
		presetId: null,
		showDelete: false
	};

	toggle = () => {
		this.setState(prevState => ({
			modal: !prevState.modal,
			nestedModal: false
		}));
	}

	toggleNested = () => {
		this.setState({ nestedModal: !this.state.nestedModal })
	}


	handleSave() {
		const preset = this.state.preset;
		const title = this.state.preset.title;
		if (title && title.length > 0) {
			this.props.onSave(title, preset);
			this.toggle();
		}
	}

	edit(preset, presetId, title) {

		// preset = {...presetId};
		if (presetId && title) {
			preset.presetId = presetId;
			preset.title = title;

		}
		// debugger;
		this.setState(
			{
				preset: preset,
				showDelete: presetId ? true : false
			},
			this.toggle
		);
	}

	titleChanged(e) {
		const newTitle = e.target.value;
		let preset = { ...this.state.preset };
		preset.title = newTitle;
		this.setState({ preset });
	}

	handleDelete() {
		this.props.onDeleteBtn(this.state.preset);
		this.toggle();
	}

	renderDelete() {
		if (this.state.showDelete === true) {
			return (
				<Button color="warning" onClick={this.toggleNested}>{Tr("Delete")}</Button>
			);
		}
	}

	render() {
		return (
			<>
				<Button
					style={{ marginTop: '0.5em' }}
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
					<ModalHeader toggle={this.toggle}>{Tr("Save Preset")}</ModalHeader>
					<ModalBody>
						<Input
							onChange={e => this.titleChanged(e)}
							placeholder={Tr("Title")}
							defaultValue={
								(this.state.preset &&
									this.state.preset.title) ||
								""
							}
						/>
						{/* <div className="code">
							{JSON.stringify(this.state.preset)}
						</div> */}
						<Modal isOpen={this.state.nestedModal} toggle={this.toggleNested}>
							<ModalHeader toggle={this.toggleNested}>{Tr("Are you sure?")}</ModalHeader>
							<ModalBody>{Tr("Are you sure to delete current preset?")}</ModalBody>
							<ModalFooter>
								<Button color="warning" onClick={() => this.handleDelete()}>{Tr("Delete")}</Button>
								<Button onClick={this.toggleNested}>{Tr("Cancel")}</Button>
							</ModalFooter>
						</Modal>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							onClick={() => this.handleSave()}
						>
							{Tr("Save")}
						</Button>{" "}
						<Button color="secondary" onClick={this.toggle}>
							{Tr("Cancel")}
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
	onDeleteBtn: function (preset) { },
	onSave: function (title, preset) { },
	onSaveBtn: function (e, idx) { }
};