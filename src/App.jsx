import React, { Component } from "react";
import "./App.css";
// import "./components/SoundMachine";
import SoundMachine from "./components/SoundMachine";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Badge, Container, Row, Col } from "reactstrap";
import SimplePanel from "./components/SimplePanel";
import ReactGA from 'react-ga';
import Tr from './components/Locale'

class App extends Component {

	state = {
		showMask: true
	}

	componentDidMount() {
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

	removeLoadMask() {
		this.setState({ showMask: false })
	}

	render() {
		return (
			<div className="App">
				<Container className="app-container ">
				{/* <Container className="app-container "> */}
					<Row>
						<Col>
							<SoundMachine ref="sm" onReady={() => this.removeLoadMask()} />
						</Col>
					</Row>
					<Row>
						<Col>
							<SimplePanel title={Tr("Keyboard controls")} className="about">
								<div><code>{Tr("arrow up/down")}</code> - {Tr("higher/lower BPM")}</div>
								<div><code>{Tr("arrow left/right")}</code> - {Tr("previous/next step according to plan")}</div>
								<div><code>space, s</code> - {Tr("start/stop")}</div>
								<div><code>esc</code> - {Tr("stop")}</div>
							</SimplePanel>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className="footer">
								{/* TODO: i18n */}
								<div><h6>If you like this app consider donation to a developer using following <Badge href="https://paypal.me/indiebubblerdev" target="blank">link</Badge></h6></div>
								<div>Join discord using <Badge href="https://discord.gg/fAwnmVh" target="blank">this link</Badge> for feedback and improvement suggestions.</div>
								<div>By using this site you agree to the use of cookies to store user defined presets and analytics.</div>
								<div>Created using <Badge href="https://reactjs.org/" target="blank" >React</Badge> and <Badge href="https://tonejs.github.io/" target="blank">Tone.js</Badge>. Source code available <Badge href="https://github.com/indiebubbler/metro">here</Badge>.</div>
								<div>If you want help translating this page please contact <Badge href="mailto:indiebubbler@gmail.com?subject=Feedback">indiebubbler@gmail.com</Badge>.</div>
								<div>&#169; IndieBubbler 2019-2020. Version 2.2</div>
							</div>
						</Col>
					</Row>
				</Container>
				<div ref="loadMask" className={this.state.showMask === true ? 'loadmask ' : 'loadmask fadeOut'} />
			</div>

		);
	}

}

export default App;