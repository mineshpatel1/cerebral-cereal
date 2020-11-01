import React from 'react';
import { RefreshControl as _RefreshControl } from 'react-native';

import { Component } from './Component';

export class RefreshControl extends Component {
  render() {
    const { Colours } = this.getTheme();

    return (
      <_RefreshControl
        colors={[Colours.primaryContrast]}
        progressBackgroundColor={Colours.primary}
        tintColor={Colours.foreground}
        refreshing={false}
        {...this.props}
      />
    );
  }
}


