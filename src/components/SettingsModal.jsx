import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Badge } from 'reactstrap';
import { ColorThemes } from './Config';

const SettingsModal = ({ isOpen, toggle, currentTheme, onThemeChange }) => {
  const [theme, setTheme] = React.useState(currentTheme);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSave = () => {
    onThemeChange(theme);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="themeSelect">Theme</Label>
          <Input type="select" name="themeSelect" id="themeSelect" value={theme} onChange={handleThemeChange}>
            {Object.keys(ColorThemes).map((themeName) => (
              <option key={themeName} value={themeName}>{themeName}</option>
            ))}
          </Input>
        </FormGroup>
        <hr />
        <div className="footer">
          <h6>
            If you like this app consider donation to a developer using following{" "}
            <Badge href="https://www.buymeacoffee.com/indiebubbler" target="blank">
              link
            </Badge>
          </h6>
          <div>
            Join discord using{" "}
            <Badge href="https://discord.gg/fAwnmVh" target="blank">
              this link
            </Badge>{" "}
            for feedback and improvement suggestions.
          </div>
          <div>
            By using this site you agree to the use of cookies to store
            user defined presets and analytics.
          </div>
          <div>
            If you want help translating this page please contact{" "}
            <Badge href="mailto:indiebubbler@gmail.com?subject=Feedback">
              indiebubbler@gmail.com
            </Badge>
            .
          </div>
          <div>
            Made using{" "}
            <Badge href="https://reactjs.org/" target="blank">
              React
            </Badge>{" "}
            and{" "}
            <Badge href="https://tonejs.github.io/" target="blank">
              Tone.js
            </Badge>
            .
          </div>
          <div>
            Ideas for visualisation and presets taken from{" "}
            <Badge
              href="http://www.ethanhein.com/wp/my-nyu-masters-thesis"
              target="blank"
            >
              Ethan Hein's site
            </Badge>
            .
          </div>
          <div>&#169; IndieBubbler 2019-2020. Version 2.2</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>Save</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default SettingsModal;
