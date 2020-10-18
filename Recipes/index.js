/**
 * @format
 */

import {AppRegistry} from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import {name as appName} from './app.json';

PushNotification.configure({
  onRegister: function(token) {},

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {},
  popInitialNotification: false,
  requestPermissions: Platform.OS === 'ios'
});

AppRegistry.registerComponent(appName, () => App);
