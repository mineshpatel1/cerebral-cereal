import { Component as ReactComponent } from 'react';
import { CurrentTheme, CommonContext } from '../contexts';

export class Component extends ReactComponent {
  static contextType = CommonContext;

  getTheme = () => {
    return CurrentTheme(this.context);
  }
}
