import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import { Component } from '../Component';
import { Spinner } from '../Spinner';
import { Toast } from '../Toast';
import { Layout } from '../../styles';
import { ColourUtils } from '../../utils/ColourUtils';

export class Container extends Component {
  static defaultProps = {
    colour: null,
    loading: false,
  }

  constructor(props) {
    super(props);
  }

  showToast = (message, mode='info') => this.toast.show(message, mode);

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
        <Toast ref={x => this.toast = x} />
        <Spinner loading={props.loading} />
      </>
    )
  }
}