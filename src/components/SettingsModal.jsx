import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Badge } from 'reactstrap';
import { ColorThemes } from './Config';
import Tr from './Locale';

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
      <ModalHeader toggle={toggle}>{Tr("Settings")}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="themeSelect">{Tr("Theme")}</Label>
          <Input type="select" name="themeSelect" id="themeSelect" value={theme} onChange={handleThemeChange}>
            {Object.keys(ColorThemes).map((themeName) => (
              <option key={themeName} value={themeName}>{themeName}</option>
            ))}
          </Input>
        </FormGroup>
        <hr />
        <h5>{Tr("Keyboard Controls")}</h5>
        <ul>
          <li><code>{Tr("(shift) arrow up/down")}</code> - {Tr("higher/lower BPM")}</li>
          <li><code>{Tr("arrow left/right")}</code> - {Tr("previous/next step according to plan")}</li>
          <li><code>space, s</code> - {Tr("start/stop")}</li>
          <li><code>esc</code> - {Tr("stop")}</li>
        </ul>
        <hr />
        <div className="footer">
          <h6>
            {Tr("If you like this app consider donation to a developer using following")}{" "}
            <Badge href="https://www.buymeacoffee.com/indiebubbler" target="blank">
              {Tr("link")}
            </Badge>
          </h6>
          <div>
            {Tr("Join discord using")}{" "}
            <Badge href="https://discord.gg/fAwnmVh" target="blank">
              {Tr("this link")}
            </Badge>{" "}
            {Tr("for feedback and improvement suggestions.")}
          </div>
          <div>
            {Tr("By using this site you agree to the use of cookies to store user defined presets and analytics.")}
          </div>
          <div>
            {Tr("If you want help translating this page please contact")}{" "}
            <Badge href="mailto:indiebubbler@gmail.com?subject=Feedback">
              indiebubbler@gmail.com
            </Badge>
            .
          </div>
          <div>
            {Tr("Made using")}{" "}
            <Badge href="https://reactjs.org/" target="blank">
              React
            </Badge>{" "}
            {Tr("and")}{" "}
            <Badge href="https://tonejs.github.io/" target="blank">
              Tone.js
            </Badge>
            .
          </div>
          <div>
            {Tr("Ideas for visualisation and presets taken from")}{" "}
            <Badge
              href="http://www.ethanhein.com/wp/my-nyu-masters-thesis"
              target="blank"
            >
              {Tr("Ethan Hein's site")}
            </Badge>
            .
          </div>
          <div>&#169; IndieBubbler 2019-2020. {Tr("Version")} 2.2</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>{Tr("Save")}</Button>
        <Button color="secondary" onClick={toggle}>{Tr("Cancel")}</Button>
      </ModalFooter>
    </Modal>
  );
}

export default SettingsModal;
