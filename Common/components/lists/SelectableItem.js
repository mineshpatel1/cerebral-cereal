import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Pressable } from '../buttons/Pressable';
import { Text } from '../Text';
import { Layout, StyleConstants } from '../../styles';

export class SelectableItem extends Component {
  static defaultProps = {
    backgroundColour: null,
    selectedColour: null,
    selectedTextColour: null,
    selected: false,
    onSelect: null,
    animationDuration: 0,
    text: null,
    height: StyleConstants.headerSize,
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const _backgroundColour = props.backgroundColour || Colours.background;
    const selectedColour = props.selectedColour || Colours.primary;
    const selectedTextColour = props.selectedTextColour || Colours.primaryContrast;

    const textColour = props.selected ? selectedTextColour : null;
    const backgroundColour = props.selected ? selectedColour : _backgroundColour;

    return (
      <View style={{backgroundColor: backgroundColour}}>
        <Pressable
          onPress={props.onSelect}
          backgroundColour={backgroundColour}
          rippleColour={Colours.primary}
          style={[
            Layout.row, Layout.aCenter, Layout.pd2,
            {
              height: props.height,
              borderBottomWidth: 1,
              borderColor: Colours.offGrey,
            }
          ]}
        >
          <Text colour={textColour}>{props.text}</Text>
        </Pressable>
      </View>
    )
  }
}
