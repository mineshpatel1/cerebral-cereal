import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Component, Container, SettingsList,
  Utils,
} from 'cerebral-cereal-common';
import { saveSettings } from 'cerebral-cereal-common/actions';
import { defaultSettings } from '../config';

class Settings extends Component {

  updateField = (field, value, allFields) => {    
    // Save state
    this.props.saveSettings(
      Utils.mapObject(allFields, v => v.value),
      defaultSettings,
    );

    // Update UI if the user changes the dark mode setting
    if (field === 'colourTheme') {
      this.context.changeTheme(Utils.appearanceMode(value));
    }
  }

  render() {
    const { props } = this;
    return (
      <Container>
        <SettingsList
          settings={props.settings}
          defaultSettings={defaultSettings}
          onUpdate={this.updateField}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ saveSettings }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
