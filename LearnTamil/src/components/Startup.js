import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';

import { Component, Text, Layout, Utils} from 'cerebral-cereal-common';
import { initSettings } from 'cerebral-cereal-common/actions';
import { initProgress } from '../actions/ProgressActions';
import { defaultSettings } from '../config';

class Startup extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      init: false,
    };
  }

  componentDidMount() {
    AsyncStorage.multiGet(['settings', 'progress'])
      .then(result => {
        const settings = JSON.parse(result[0][1]);
        const colourTheme = settings ? settings.colourTheme : null;
        const theme = Utils.appearanceMode(colourTheme);

        this.context.changeTheme(theme, () => {
          this.setState({init: true});
        });

        this.props.initSettings(settings, defaultSettings);
        this.props.initProgress(JSON.parse(result[1][1]));
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    if (this.state.init) {
      return this.props.children;
    } else {
      return (
        <View style={[Layout.f1, Layout.center]}>
          <Text>Loading...</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    progress: state.progress,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ initProgress, initSettings }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
