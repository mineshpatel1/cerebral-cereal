import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';

import { Layout } from '../styles';

const maxWidth = Dimensions.get('window').width;

export class ScreenContainer extends Component {
  static defaultProps = {
    children: null,
    style: null,
  }

  render() {
    return (
      <View style={[
        Layout.pdx2, Layout.f1, Layout.mt1, {width: maxWidth},
        this.props.style,
      ]}>
        {this.props.children}
      </View>
    )
  }
}