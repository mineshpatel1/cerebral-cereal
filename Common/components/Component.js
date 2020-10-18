import { Component as ReactComponent } from 'react';
import { CurrentTheme, ThemeContext } from '../contexts';

export class Component extends ReactComponent {
  static contextType = ThemeContext;

  getTheme = () => {
    return CurrentTheme(this.context);
  }
}
