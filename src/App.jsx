import React, { Component } from "react";
import "./App.css";
import "./components/SoundMachine";
import SoundMachine from "./components/SoundMachine";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";
import { withCookies } from "react-cookie";
import SimplePanel from "./components/SimplePanel";
import ReactGA from 'react-ga';

class App extends Component {
	componentDidMount() {

		// keyboard listeners
		document.addEventListener("keydown", e => this.handleKeyDown(e));

		// google analytics
		ReactGA.initialize({
			trackingId: 'UA-151010848-1',
			debug: true,
			gaOptions: {
				cookieDomain: 'none'
			}
		});
		ReactGA.pageview(window.location.pathname + window.location.search);

	}


	handleKeyDown(e) {
		switch (e.keyCode) {
			case 83: // s
				this.refs.sm.start();
				break;
			case 32: // space
				// if you prevent you won't be able to use space in preset name...
				// e.preventDefault();
				// advance plan or toggle
				// this.refs.sm.state.isPlaying ? this.refs.sm.refs.planner.stepForward() : this.refs.sm.toggle();
				break;
			case 27: // ESC
				this.refs.sm.stop();
				// this.refs.sm.refs.planner.resetStep()

				break;
			case 38: // Arrow up
				e.preventDefault();

				if (this.refs.sm.state.bpm < 600) {
					this.refs.sm.setBpm(this.refs.sm.state.bpm + 10);
				}
				break;
			case 40: // arrow down
				e.preventDefault();
				if (this.refs.sm.state.bpm > 10) {
					this.refs.sm.setBpm(this.refs.sm.state.bpm - 10);
				}
				break;
			case 37: // Arrow left
				e.preventDefault();
				this.refs.sm.refs.planner.stepBackward();
				break;
			case 39: // Arrow right
				e.preventDefault();
				this.refs.sm.refs.planner.stepForward();
				break;
			default:
		}
	}

	render() {
		return (
			<div className="App">
				<Container className="app-container">
					<Row>
						<Col>
							<SoundMachine
								ref="sm"
								cookies={this.props.cookies}
							>
							</SoundMachine>
						</Col>

					</Row>
					<Row>
						<Col>
							<SimplePanel title={"Keyboard controls"} className="about">
								<div><code>up/down</code> - adjust tempo</div>
								<div><code>left/right</code> - previous/next step according to plan</div>
								<div><code>space</code> - start/next step</div>
								<div><code>esc</code> - stop</div>
							</SimplePanel>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className="footer">
								<div>By using this site you agree to the use of cookies to store user defined presets.</div>
								<div>Created using React and <a href="https://tonejs.github.io/" rel="noopener noreferrer" target="_blank">Tone.js</a>. Source code available <a href="https://github.com/indiebubbler/metro">here</a>. <br />Contact dev at <a href="mailto:indiebubbler@gmail.com?subject=Feedback">indiebubbler@gmail.com</a>.</div>
							</div>
						</Col>
					</Row>
				</Container>

			</div>
		);
	}

}

export default withCookies(App);