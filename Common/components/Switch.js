import React from 'react';
import { Switch as ReactSwitch } from 'react-native';

import { Component } from './Component';

export class Switch extends Component {
  render() {
    const { Colours } = this.getTheme();
    return (
      <ReactSwitch
        {...this.props}
        trackColor={{true: Colours.primaryLight, false: Colours.offGrey}}
        thumbColor={this.props.value ? Colours.primary : Colours.disabled}
      />
    );
  }
}