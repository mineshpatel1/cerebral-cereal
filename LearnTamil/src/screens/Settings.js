import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Component, ConfirmModal, Container, SettingsList, Utils } from 'cerebral-cereal-common';
import { saveSettings } from 'cerebral-cereal-common/actions';
import { defaultSettings } from '../config';
import { clearProgress } from '../actions/ProgressActions';

class Settings extends Component {
  constructor(props) {
    super(props);
    // this.defaultSettings = Utils.clone(defaultSettings);
    // this.defaultSettings.clearProgress.onPress = this.toggleModal;
    this.state = {
      showModal: false,
    }
  }

  toggleModal = () => {
    if (!Utils.isEmpty(this.props.progress)) {
      this.setState({showModal: !this.state.showModal});
    }
  }

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
    let _defaultSettings = Utils.clone(defaultSettings);
    _defaultSettings.clearProgress.onPress = this.toggleModal;
    _defaultSettings.clearProgress.disabled = Utils.isEmpty(props.progress);
    return (
      <Container>
        <ConfirmModal
          message="Are you sure you want to clear progress?"
          visible={this.state.showModal}
          onCancel={this.toggleModal}
          onConfirm={() => {
            this.props.clearProgress();
            this.toggleModal();
          }}
        />
        <SettingsList
          settings={props.settings}
          defaultSettings={_defaultSettings}
          onUpdate={this.updateField}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    progress: state.progress,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ saveSettings, clearProgress }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
