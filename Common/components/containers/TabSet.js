import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Pressable } from '../buttons/Pressable';
import { Text } from '../Text';
import { Layout } from '../../styles';

export class TabSet extends Component {
  static defaultProps = {
    tabs: [],  // Array of {text, onPress}
    selected: 0,
    colour: null,
    selectionColour: null,
    indicatorColour: null,
    borderColour: null,
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const { selected} = props;

    // Default colour values
    const colour = props.colour || Colours.disabled;
    const selectionColour = props.selectionColour || Colours.iconHighlight;
    const indicatorColour = props.indicatorColour || Colours.primary;
    const borderColour = props.borderColour || Colours.offGrey;

    const tabElements = [];
    let selectedIndex = -1;
    props.tabs.forEach((tab, i) => {
      if (i == selected) selectedIndex = i;
      const textColour = i == selected ? selectionColour : colour;
      const divider = i < (props.tabs.length - 1) ? {borderRightWidth: 1, borderColor: Colours.offGrey} : null;

      tabElements.push(
        <Pressable
          key={i} onPress={tab.onPress}
          backgroundColour={Colours.background}
          containerStyle={[Layout.f1, Layout.center, divider]}
          style={[Layout.f1, Layout.center, {width: '100%'}]}
        >
          <Text colour={textColour}>{tab.text}</Text>
        </Pressable>
      )
    });

    return (
      <View style={[
        Layout.row,
        {
          borderBottomWidth: 2,
          borderColor: borderColour,
          height: 42,
        },
        props.style,
      ]}>
        {/* Indicator bar */}
        <View style={{
          height: 2,
          width: (100 / props.tabs.length) + '%',
          position: 'absolute',
          left: props.indicatorPos,
          top: 42 - 2,
          backgroundColor: indicatorColour,
        }} />
        {tabElements}
      </View>
    )
  }
}
