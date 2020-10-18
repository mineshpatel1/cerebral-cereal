import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Component } from './Component';
import { Layout, Styles } from '../styles';

export class Spinner extends Component {
  static defaultProps = {
    colour: null,
    size: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const colour = props.colour || Colours.primary;

    return (
      <View style={[Layout.center, Styles.screenCover]}>
        <ActivityIndicator size={this.props.size} color={colour} />
      </View>
    )
  }
}