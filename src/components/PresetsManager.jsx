import React, { Component } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import EditPresetModal from "./EditPresetModal"
import ImportDialog from "./ImportDialog"
import { PresetsLib, InitPreset } from './PresetsLib'
import { Samples } from "./Instruments"
import Tr from './Locale'
import SimplePanel from "./SimplePanel";
import Utils from "./Utils"
import Config from "./Config";

class PresetsManager extends Component {
	state = {
		showDelete: [],
		showEdit: [],
		userPresets: []
	};

	constructor(props) {
		super(props);

		const storedPresets = localStorage.getItem('userPresets');
		this.state.userPresets = storedPresets ? JSON.parse(storedPresets) : [];

		this.state.showDelete = this.state.userPresets ? Array(this.state.userPresets.length).fill(false) : []
		this.state.showEdit = this.state.userPresets ? Array(this.state.userPresets.length).fill(false) : []
	}

	// Old version of app didn't use certain properties.
	// If user did store some ancient presets in cookie this will make it work again
	validatePreset(preset) {

		preset.byBarInterval = preset.byBarInterval || preset.interval || InitPreset.byBarInterval;
		preset.byTimeInterval = preset.byTimeInterval || preset.interval || InitPreset.byTimeInterval;
		// change from accents into track
		if (!preset.track) {
			let track = [];
			preset.accents.map(item => {
				track.push([item])
				// expected te return value in arrow function
				return true;
			})
			preset.track = track;
		}


		// if no timeSignature then we're dealing with tracks made before polyrythm support. Fix them now.
		if (!preset.timeSignature) {
			const timeSignature = preset.track.length
			preset.timeSignature = timeSignature

			var track = new Array(Config.TRACKS_NUMBER).fill(0).map(x => new Array(timeSignature).fill(0));


			for (let beatIdx = 0; beatIdx < preset.track.length; beatIdx++) {
				const beats = preset.track[beatIdx];
				for (let beat = 0; beat < beats.length; beat++) {
					track[beats[beat]][beatIdx] = 1;	// set volume to one, effectively enabling it
				}
			}
			preset.track = track;
		}

		if (!preset.samples) {
			preset.samples = this.convertInstrumentKeyToSamples(preset.instrumentKey)
		}

		return preset;
	}

	convertInstrumentKeyToSamples(instrumentKey) {
		// desired result: "samples": [{instrumentKey: 'tabla', file: 'dha-slide.wav' }, {instrumentKey: 'electrokit', file: 'Kick.wav'}, {instrumentKey: 'metronome', file: 'tap.wav'}],
		const samples = Samples.filter(el => el.instrumentKey === instrumentKey);
		return samples;
	}

	onPresetClick(preset) {
		this.props.onSelect(this.validatePreset(preset));
	}

	onSavePreset(title, o) {
		const preset = { title: title, ...o }

		// if it's got presetId then overwrite preset with such id
		// if no presetId then create it here
		if (preset.presetId === undefined) {
			let presetId = 1;
			if (this.state.userPresets.length > 0) {
				// find max and add 1
				presetId = Math.max.apply(Math, this.state.userPresets.map(function (p) { return p.presetId; }));
				presetId++
			}

			// assign id
			preset.presetId = presetId;
		}


		// update date
		preset.savedDtm = new Date();

		let userPresets = this.state.userPresets;

		// if (!userPresets) {
		// 	userPresets = [];
		// }

		// overwrite by presetId
		let idx = this.state.userPresets.findIndex(o => o.presetId === preset.presetId);

		if (idx < 0) {
			userPresets.push(preset)
		}
		else {
			userPresets[idx] = preset;
		}


		this.saveInLocalStorage(userPresets);
		// window.localStorage.setItem(preset.title, preset);
	}

	saveInLocalStorage(presets) {
		localStorage.setItem('userPresets', JSON.stringify(presets))
		this.setState({ userPresets: presets })
	}

	showDeleteBtn(e, idx) {
		let showDelete = { ...this.state };
		showDelete[idx] = true;
		this.setState({ showDelete });
	}

	showEditBtn(e, idx, presetId) {
		let showEdit = { ...this.state };
		showEdit[idx] = true;
		this.setState({ showEdit });
	}
	hideEditBtn(e) {
		this.setState({ showEdit: false })
	}

	onPresetDelete(preset) {
		let idx = this.state.userPresets.findIndex(o => o.presetId === preset.presetId);
		let newPresets = this.state.userPresets.slice();

		// let idx = this.state.userPresets.indexOf(preset)
		if (idx < 0) {
			throw new Error("Selected preset " + preset.title + " has not been found in the store")
		}

		// remove preset
		newPresets.splice(idx, 1);
		this.saveInLocalStorage(newPresets);
	}

	onPresetEdit(e, idx) {
		var p = this.props.getPreset();

		if (idx !== undefined) {

			this.refs.presetEditor.edit(p, this.state.userPresets[idx].presetId, this.state.userPresets[idx].title)
		}
		else {
			this.refs.presetEditor.edit(p)
		}
	}

	onImportBtn(e) {
		this.refs.importDialog.open()
	}

	renderUserPresets(userPresets) {
		if (userPresets.length === 0) {
			return;
		}

		return (
			<>
				<Row>
					{Tr("User presets")}:
				</Row>
				{userPresets.map((item, idx) => (
					<Row className="presetItem clickable"
						onClick={() => this.onPresetClick(item)}
						key={"preset_" + idx}
					>
						<Col style={{ textAlign: 'left' }} >
							{item.title}
						</Col>
						<Col xs="auto" className="userPresetSavedDtm">
							{Utils.toLocaleDateTime(item.savedDtm)}
						</Col>
						<Col>
							<Button size="sm" outline
								onClick={(e) => this.onPresetEdit(e, idx)}>
								{Tr("Edit")}
							</Button>
						</Col>
						{/* // <div className='editBtn clickable' onClick={(e) =>}></div> */}
					</Row>

				))}
			</>
		);
	}

	onExport() {

		const a = document.createElement('a');
		const file = new Blob([JSON.stringify(this.state.userPresets)], { type: 'application/json' });
		a.href = URL.createObjectURL(file);
		a.download = 'presets.json';
		a.click();
	}

	onPresetsImport(presets) {
		presets.forEach(p => {
			p = this.validatePreset(p);
			// unset presetId so we won't overwrite anything that's there already
			p.presetId = undefined
			this.onSavePreset(p.title, p);
		})
		
		this.refs.importDialog.close();
		// onSavePreset(preset.title, presets)
	}

	render() {
		const userPresetsJson = localStorage.getItem('userPresets');
		let userPresets = userPresetsJson ? JSON.parse(userPresetsJson) : [];

		return (
			<SimplePanel className="PresetsManager" title={Tr("Presets")}>
				<Container>
					{PresetsLib.map((item, idx) => {
						if (item.isHeader) {
							return (
								<Row
									className={"presetHeader"}
									key={"header_" + idx}
								>
									{Tr(item.title)}:
								</Row>
							);
						}
						else {
							return (
								<Row
									onClick={() => this.onPresetClick(item)}
									className={"presetItem clickable"}
									key={"preset_" + idx}
								>
									{item.title}
								</Row>
							);
						}
					})}
					{this.renderUserPresets(userPresets)}
					{/* center button */}
					<Row style={{ justifyContent: 'center' }}>
						<EditPresetModal ref='presetEditor' onDeleteBtn={(preset) => this.onPresetDelete(preset)} onSaveBtn={(e, idx) => this.onPresetEdit(e, idx)} onSave={(title, preset) => this.onSavePreset(title, preset)} />
						<ImportDialog ref='importDialog' onImportBtn={() => this.onImportBtn()} onJsonReady={(presets) => this.onPresetsImport(presets)}/>
						<Button style={{ marginTop: '0.5em' }} outline  size="sm" color="light" onClick={() => this.onExport()}>{Tr("Export to file")}</Button>
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
