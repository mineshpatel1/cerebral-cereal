import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import { Component } from './Component';
import { Layout } from '../styles';
import { ColourUtils } from '../utils/ColourUtils';

export class Container extends Component {
  static defaultProps = {
    colour: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const colour = props.colour || Colours.background;

    const statusStyle = ColourUtils.isDark(colour) ? 'light-content' : 'dark-content';

    return (
      <>
        <StatusBar backgroundColor={colour} barStyle={statusStyle} />
        <SafeAreaView style={[Layout.f1, { backgroundColor: colour }]}>
          <View style={[Layout.f1, props.style]}>
            {props.children}
          </View>
        </SafeAreaView>
      </>
    )
  }
}