import React, { Component } from "react";
import "./App.css";
import SoundMachine from "./components/SoundMachine";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, Nav, Button, ButtonGroup } from "reactstrap";
//import ReactGA from "react-ga";
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
    showPresets: false,
  };

  updateThemeColor = () => {
    const themeColor = ColorThemes[this.state.currentTheme][0];
    document.documentElement.style.setProperty("--theme-color-0", themeColor);
    document.documentElement.style.setProperty("--active-color", themeColor);
  };

  toggleSettingsModal = () => {
    this.setState((prevState) => ({
      showSettingsModal: !prevState.showSettingsModal,
    }));
  };

  handleThemeChange = (newTheme) => {
    this.setState({ currentTheme: newTheme }, () => {
      Config.COLOR_PALETTE = ColorThemes[newTheme];
      this.updateThemeColor();
      // You might need to trigger a re-render of components that use the theme
      if (this.soundMachine) {
        this.soundMachine.forceUpdate();
      }
    });
  };

  handleBpmChange = (bpm, tempoMarking) => {
    this.setState({ bpm, tempoMarking });
  };

  togglePresetsVisibility = () => {
    this.setState((prevState) => ({
      showPresets: !prevState.showPresets,
    }));
  };

  componentDidMount() {
    this.updateThemeColor();
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
            backgroundColor: "var(--main-bg-color)",
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
            <ButtonGroup>
              <Button
                color={this.state.showPresets ? "primary" : "light"}
                onClick={this.togglePresetsVisibility}
              >
                <i className="fas fa-list"></i>
              </Button>
              <Button color="light" onClick={this.toggleSettingsModal}>
                <i className="fas fa-cog"></i>
              </Button>
            </ButtonGroup>
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
                showPresets={this.state.showPresets}
              >
                {this.soundMachine && this.soundMachine.renderControlPanel()}
              </SoundMachine>
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
