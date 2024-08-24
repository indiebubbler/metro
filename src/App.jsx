import React, { Component } from "react";
import "./App.css";
import SoundMachine from "./components/SoundMachine";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Badge, Container, Row, Col, Navbar, Nav, Button } from "reactstrap";
import SimplePanel from "./components/SimplePanel";
import ReactGA from "react-ga";
import Tr from "./components/Locale";
import { getPlayModeFromUrl } from "./components/PlayModes";
import Config, { ColorThemes } from "./components/Config";
import SettingsModal from "./components/SettingsModal";

class App extends Component {
  state = {
    showMask: true,
    bpm: 120,
    tempoMarking: "Moderato",
    showSettingsModal: false,
    currentTheme: "muted",
  };

  toggleSettingsModal = () => {
    this.setState(prevState => ({
      showSettingsModal: !prevState.showSettingsModal
    }));
  }

  handleThemeChange = (newTheme) => {
    this.setState({ currentTheme: newTheme });
    Config.COLOR_PALETTE = ColorThemes[newTheme];
    // You might need to trigger a re-render of components that use the theme
    if (this.soundMachine) {
      this.soundMachine.forceUpdate();
    }
  }

  handleBpmChange = (bpm, tempoMarking) => {
    this.setState({ bpm, tempoMarking });
  }

  componentDidMount() {
    // google analytics
    //ReactGA.initialize({
    //trackingId: "UA-151010848-1",
    //debug: false,
    //gaOptions: {
    //cookieDomain: "none",
    //},
    //});
    //ReactGA.pageview(window.location.pathname + window.location.search);
  }

  removeLoadMask() {
    this.setState({ showMask: false });
  }

  render() {
    return (
      <div className="App">
        <Navbar
          style={{ 
            backgroundColor: 'var(--main-bg-color)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          dark
          expand="md"
          fixed="top"
          className="top-menubar"
        >
          <Nav
            className="w-100 justify-content-between align-items-center"
            navbar
          >
            {this.state.soundMachine && (
              <>{this.state.soundMachine.renderControlPanel()}</>
            )}
            <Button color="light" onClick={this.toggleSettingsModal}>
              <i className="fas fa-cog"></i>
            </Button>
          </Nav>
        </Navbar>
        <Container className="app-container">
          <Row>
            <Col>
              <SoundMachine
                ref={(sm) => {
                  this.soundMachine = sm;
                }}
                onReady={() => {
                  this.removeLoadMask();
                  this.setState({ soundMachine: this.soundMachine });
                }}
                initialPlayMode={getPlayModeFromUrl()}
                onBpmChange={this.handleBpmChange}
              >
                {this.soundMachine && this.soundMachine.renderControlPanel()}
              </SoundMachine>
            </Col>
          </Row>
          <Row>
            <Col>
              <SimplePanel title={Tr("Keyboard controls")} className="about">
                <div>
                  <code>{Tr("(shift) arrow up/down")}</code> -{" "}
                  {Tr("higher/lower BPM")}
                </div>
                <div>
                  <code>{Tr("arrow left/right")}</code> -{" "}
                  {Tr("previous/next step according to plan")}
                </div>
                <div>
                  <code>space, s</code> - {Tr("start/stop")}
                </div>
                <div>
                  <code>esc</code> - {Tr("stop")}
                </div>
              </SimplePanel>
            </Col>
          </Row>
        </Container>
        <div
          ref="loadMask"
          className={
            this.state.showMask === true ? "loadmask " : "loadmask fadeOut"
          }
        />
        <SettingsModal 
          isOpen={this.state.showSettingsModal} 
          toggle={this.toggleSettingsModal}
          currentTheme={this.state.currentTheme}
          onThemeChange={this.handleThemeChange}
        />
      </div>
    );
  }
}

export default App;
