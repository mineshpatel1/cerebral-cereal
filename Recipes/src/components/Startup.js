import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

import { Component, Text, Layout, Utils} from 'cerebral-cereal-common';
import { initSettings } from 'cerebral-cereal-common/actions';
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
    AsyncStorage.multiGet(['settings'])
      .then(result => {
        const settings = JSON.parse(result[0][1]);  // Settings Value
        const colourTheme = settings ? settings.colourTheme : null;
        const theme = Utils.appearanceMode(colourTheme);

        this.context.changeTheme(theme, () => {
          this.setState({init: true}, () => SplashScreen.hide());
        });

        this.props.initSettings(settings, defaultSettings);
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
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ initSettings }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
