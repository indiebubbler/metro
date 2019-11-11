import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import EditPresetModal from "./EditPresetModal"
import {PresetsLib} from './PresetsLib'

class PresetsManager extends Component {
	state = {
		showDelete: [],
		showEdit: []
	};

	constructor(props) {
		super(props);

		// this.userPresets = '{}'
		console.log('PresetsManager constructor')
		this.userPresets = this.props.cookies.get('userPresets');

		this.state.showDelete = this.userPresets ? Array(this.userPresets.length).fill(false) : []
		this.state.showEdit = this.userPresets ? Array(this.userPresets.length).fill(false) : []
	}

	onPresetClick(preset) {
		this.props.onSelect(preset);
	}

	onSavePreset(title, o) {
		const preset = { title: title, ...o }

		let userPresets = this.props.cookies.get('userPresets');

		if (!userPresets) {
			userPresets = [];
		}

		// overwrite by title 
		let idx = -1;

		for (let i = 0; i < userPresets.length; i++) {
			if (userPresets[i].title.toLowerCase() === title.toLowerCase()) {
				idx = i;
			}
		}
		if (idx < 0) {
			userPresets.push(preset)
		}
		else {
			userPresets[idx] = preset;
		}

		this.saveInCookie(userPresets);
	}

	saveInCookie(presets) {
		this.props.cookies.set('userPresets', JSON.stringify(presets), { path: '/' });
		this.userPresets = presets;
	}

	showDeleteBtn(e, idx) {
		let showDelete = { ...this.state };
		showDelete[idx] = true;
		this.setState({ showDelete });
	}

	showEditBtn(e, idx) {
		let showEdit = { ...this.state };
		showEdit[idx] = true;
		this.setState({ showEdit });
	}
	hideEditBtn(e) {
		this.setState({ showEdit: false })
	}

	onPresetDelete(preset) {
		let idx = this.userPresets.indexOf(preset)
		if (idx < 0) {
			throw new Error("Selected preset " + preset.title + " has not been found in the store")
		}
		this.userPresets.splice(idx, 1);
		this.saveInCookie(this.userPresets);
	}

	onPresetEdit(e, idx) {
		// console.log('preset EDIT',e,idx);
		/// prevent from triggerring onClick 
		e.stopPropagation()


		if (idx !== undefined) {
			this.refs.presetEditor.edit(this.userPresets[idx], true)
		}
		else {
			// new preset
			var p = this.props.getPreset();
			this.refs.presetEditor.edit(p)
		}
	}

	setPreset(preset) {

	}

	render() {
		// const userPresets = this.props.cookies.cookies.userPresets ? JSON.parse(this.props.cookies.cookies.userPresets) : [];
		const userPresets = []

		// // console.log('<PresetsManager>userPresets', userPresets)
		return (
			<Container className="PresetsManager">
				{/* <Row>
					{this.props.presets.map((item, idx) => (
						<Col className="preset" hidden={item.isHidden}
							onClick={() => this.onPresetClick(item)}
							key={"preset_" + idx}
						>
							{item.title}
						</Col>
					))}
				</Row> */}
				{/* <Row> */}
					{PresetsLib.map((item, idx) => (
						<Row
							onClick={() => this.onPresetClick(item)}
							className={"step"}
							key={"preset_" + idx}
						>
							{item.title}
						</Row>
					))}
				{/* </Row> */}
				<Row>
					Saved presets:
				</Row>
				<Row>
					{userPresets.map((item, idx) => (
						<Col className="preset"
							onMouseEnter={(e) => this.showEditBtn(e, idx)}
							onMouseLeave={(e) => this.hideEditBtn(e, idx)}
							onClick={() => this.onPresetClick(item)}
							key={"preset_" + idx}
						>
							{item.title}
							<div className='x' style={{ visibility: this.state.showEdit[idx] ? '' : 'hidden' }} onClick={(e) => this.onPresetEdit(e, idx)}>Edit</div>
						</Col>

					))}
				</Row>
				<Row>
					<EditPresetModal ref='presetEditor' onDeleteBtn={(preset) => this.onPresetDelete(preset)} onSaveBtn={(e, idx) => this.onPresetEdit(e, idx)} onSave={(title, preset) => this.onSavePreset(title, preset)} />
				</Row>
			</Container>
		);
	}
}

export default PresetsManager;

PresetsManager.defaultProps = {
	onSelect: function (preset) { }
};
