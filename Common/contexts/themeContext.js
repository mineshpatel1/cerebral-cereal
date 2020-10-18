import React, { Component } from 'react';
import { Themes } from '../styles';
import { Utils } from '../utils/Utils';

const defaultTheme = 'dark';

export const ThemeContext = React.createContext();

export class ThemeProvider extends Component {
  static defaultProps = {
    themeName: defaultTheme,
  }
  
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const context = {
      themeName: this.state.themeName,
      theme: this.state.theme,
      changeTheme: this.changeTheme,
    }
    return (
      <ThemeContext.Provider value={context}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

export const CurrentTheme = context => {
  return Utils.isEmpty(context) ? Themes[defaultTheme] : context.theme;
};