import React from 'react';
import { View } from 'react-native';

import { Component } from './Component';

export class RadioButton extends Component {
  static defaultProps = {
    selected: false,
    colour: null,
    selectedColour: null,
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const _colour = props.colour || Colours.disabled;
    const selectedColour = props.selectedColour || Colours.primary;
    const colour = props.selected ? selectedColour : _colour;
    return (
      <View
        style={[
          Styles.radioOuter,
          {borderColor: colour},
        ]}
      >
        {
          props.selected &&
          <View
            style={[
              Styles.radioInner,
              {backgroundColor: colour},
            ]}
          />
        }
      </View>
    )
  }
}