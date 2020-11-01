import React, { Component } from 'react';
import NetInfo from "@react-native-community/netinfo";

import { Themes } from '../styles';
import { Utils } from '../utils/Utils';

const DEFAULT_THEME = 'dark';

export const CommonContext = React.createContext();

export class CommonProvider extends Component {
  static defaultProps = {
    themeName: DEFAULT_THEME,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      themeName: this.props.themeName,
      theme: Themes[this.props.themeName],
    }
  }

  changeTheme = (themeName, callback) => {
    if (themeName !== this.state.themeName) {
      this.setState({themeName, theme: Themes[themeName]}, callback);
    } else {
      if (callback) callback();
    }
  }

  connectivityChange = connState => {
    this.setState({ isConnected: connState.isInternetReachable });
  }

  componentDidMount = () => {
    this.removeListener = NetInfo.addEventListener(this.connectivityChange);
  }

  componentWillUnmount = () => {
    if(this.removeListener) this.removeListener();
  }

  render() {
    const context = {
      isConnected: this.state.isConnected,
      themeName: this.state.themeName,
      theme: this.state.theme,
      changeTheme: this.changeTheme,
    }
    return (
      <CommonContext.Provider value={context}>
        {this.props.children}
      </CommonContext.Provider>
    )
  }
}

export const CurrentTheme = context => {
  return Utils.isEmpty(context) ? Themes[DEFAULT_THEME] : context.theme;
};