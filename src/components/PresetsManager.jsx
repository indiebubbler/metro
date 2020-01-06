import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import EditPresetModal from "./EditPresetModal"
import { PresetsLib, InitPreset } from './PresetsLib'
import Tr, { GetNavigatorLanguage } from './Locale'
import SimplePanel from "./SimplePanel";
import Utils from "./Utils"

class PresetsManager extends Component {
	state = {
		showDelete: [],
		showEdit: [],
		userPresets: []
	};

	constructor(props) {
		super(props);

		// const isStorageAvailable = Utils.storageAvailable('localStorage')
		// this.userPresets = '{}'
		const storedPresets = localStorage.getItem('userPresets');
		this.state.userPresets =  storedPresets ? JSON.parse(storedPresets) : [];

		this.state.showDelete = this.state.userPresets ? Array(this.state.userPresets.length).fill(false) : []
		this.state.showEdit = this.state.userPresets ? Array(this.state.userPresets.length).fill(false) : []
	}

	// Old version of app didn't use certain properties.
	// If user did store some ancient presets in cookie this will make it work again
	validatePreset(preset) {

		preset.byBarInterval = preset.byBarInterval || preset.interval || InitPreset.byBarInterval;
		preset.byTimeInterval = preset.byTimeInterval || preset.interval || InitPreset.byTimeInterval;
		preset.instrumentKey = preset.instrumentKey || preset.instrument.key;

		if (!preset.track) {
			let track = [];
			preset.accents.map(item => {
				track.push([item])
			})
			preset.track = track;
		}
		return preset;
	}

	onPresetClick(preset) {
		this.props.onSelect(this.validatePreset(preset));
	}

	onSavePreset(title, o) {
		const preset = { title: title, ...o }

		preset.savedDtm = new Date();
		 
		let userPresets = this.state.userPresets;

		// if (!userPresets) {
		// 	userPresets = [];
		// }
debugger
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

		// update date


		this.saveInLocalStorage(userPresets);
		// window.localStorage.setItem(preset.title, preset);
	}

	saveInLocalStorage(presets) {
		// this.props.cookies.set('userPresets', JSON.stringify(presets), { path: '/' });
		localStorage.setItem('userPresets', JSON.stringify(presets))
		this.setState({userPresets: presets})
		// // this.userPresets = presets;
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
		let idx = this.state.userPresets.indexOf(preset)
		if (idx < 0) {
			throw new Error("Selected preset " + preset.title + " has not been found in the store")
		}
		const presets = this.state.userPresets.splice(idx, 1);
		
		this.saveInLocalStorage(presets);
	}

	onPresetEdit(e, idx) {
		/// prevent from triggerring onClick 
		e.stopPropagation()

		if (idx !== undefined) {
			this.refs.presetEditor.edit(this.state.userPresets[idx], true)
		}
		else {
			// new preset
			var p = this.props.getPreset();
			this.refs.presetEditor.edit(p)
		}
	}

	renderUserPresets(userPresets) {
		if (userPresets.length == 0) {
			return;
		}

		return (
			<>
				<Row>
					{Tr("User presets:")}
				</Row>
				{userPresets.map((item, idx) => (
					<Row className="presetItem clickable"
						onMouseEnter={(e) => this.showEditBtn(e, idx)}
						onMouseLeave={(e) => this.hideEditBtn(e, idx)}
						onClick={() => this.onPresetClick(item)}
						key={"preset_" + idx}
					>
						{item.title}<div className="userPresetSavedDtm">{item.savedDtm ? new Date(item.savedDtm).toLocaleDateString(GetNavigatorLanguage()) + ' ' + new Date(item.savedDtm).toLocaleTimeString(GetNavigatorLanguage()) : ''}</div>
						<div className='editBtn clickable' style={{ visibility: this.state.showEdit[idx] ? '' : 'hidden' }} onClick={(e) => this.onPresetEdit(e, idx)}>{Tr("Edit")}</div>
					</Row>

				))}
			</>
		);
	}
	// setPreset(preset) {

	// }

	render() {
		const userPresetsJson = localStorage.getItem('userPresets');
		let userPresets = userPresetsJson ?  JSON.parse(userPresetsJson) : [];
		
		// let userPresets = [];
		// // console.log('<PresetsManager>userPresets', userPresets)
		return (
			<SimplePanel className="PresetsManager" title={Tr("Presets")}>
				<Container>
							{PresetsLib.map((item, idx) => (
								<Row
									onClick={() => this.onPresetClick(item)}
									className={"presetItem clickable"}
									key={"preset_" + idx}
								>
									{item.title}
								</Row>
							))}
							{this.renderUserPresets(userPresets)}
					<Row>
						<EditPresetModal ref='presetEditor' onDeleteBtn={(preset) => this.onPresetDelete(preset)} onSaveBtn={(e, idx) => this.onPresetEdit(e, idx)} onSave={(title, preset) => this.onSavePreset(title, preset)} />
					</Row>
				</Container>
			</SimplePanel>
		);
	}
}

export default PresetsManager;

PresetsManager.defaultProps = {
	onSelect: function (preset) { }
};
