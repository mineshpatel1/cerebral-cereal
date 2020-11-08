import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

import { Component, Text, Layout, Utils} from 'cerebral-cereal-common';
import { initSettings } from 'cerebral-cereal-common/actions';
import { defaultSettings } from '../config';
import { checkUser } from '../actions/UserActions';
const googleCreds = require('../../private/google-services.json');

class Startup extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      init: false,
    };
  }

  loadSettings = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.multiGet(['settings'])
        .then(result => {
          const settings = JSON.parse(result[0][1]);  // Settings Value
          const colourTheme = settings ? settings.colourTheme : null;
          const theme = Utils.appearanceMode(colourTheme);
          this.props.initSettings(settings, defaultSettings);
          this.context.changeTheme(theme, resolve);
        })
        .catch(reject);
    });
  }

  checkUser = () => {
    return new Promise((resolve) => {
      if (!this.context.isConnected) return resolve();
      GoogleSignin.configure({
        webClientId: googleCreds.web.client_id,
        iosClientId: googleCreds.ios.client_id,
      });

      this.props.checkUser()
        .then(resolve)
        .catch(() => resolve());       
    });
  }

  componentDidMount() {
    const waitSettings = this.loadSettings();
    const waitUser = this.checkUser();

    Promise.all([waitSettings, waitUser])
      .then(() => {
        this.setState({init: true}, () => SplashScreen.hide());
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
  bindActionCreators({ initSettings, checkUser }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
