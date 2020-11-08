import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Component } from './Component';
import { Layout } from '../styles';

export class Spinner extends Component {
  static defaultProps = {
    colour: null,
    size: null,
    loading: false,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const colour = props.colour || Colours.primary;

    return (
      <>
      {
        props.loading &&
        <>
          <View style={[Layout.center, Styles.screenCover, {opacity: 0.5, backgroundColor: Colours.black}]} />
          <View style={[Layout.center, Styles.screenCover]}>
            <ActivityIndicator size={this.props.size} color={colour} />
          </View>
        </>
      }
      </>
    )
  }
}