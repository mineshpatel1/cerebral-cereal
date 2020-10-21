import React from 'react';
import { Pressable } from 'react-native';

import { Component } from './Component';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';
import { Text } from './Text';
import { Layout } from '../styles';

export class ChecklistItem extends Component {
  static defaultProps = {
    checked: false,
    textColour: null,
    checkColour: null,
    selectedCheckColour: null,
    selectedTextColour: null,
    selectedTextProps: {bold: true},
    onPress: null,
    animationDuration: 0,
    text: null,
    icon: null,
    style: null,
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const { animationDuration, icon, onPress, checked, style, text } = props;

    // Default colour values
    const _textColour = props.textColour || Colours.disabled;
    const checkColour = props.checkColour || Colours.disabled;
    const selectedTextColour = props.selectedTextColour || Colours.foreground;
    const selectedCheckColour = props.selectedCheckColour || Colours.primary;

    const textColour = props.checked ? selectedTextColour : _textColour;
    const selectedTextProps = props.checked ? props.selectedTextProps : {};

    return (
      <Pressable
        onPress={onPress}
        accessibilityState={{checked}}
        style={[Layout.row, Layout.aCenter, style]}
      >
        <Checkbox
          checked={checked}
          onPress={onPress}
          colour={checkColour}
          selectedColour={selectedCheckColour}
          animationDuration={animationDuration}
        />
        { icon && <Icon icon={icon} style={[Layout.ml1]} colour={textColour} size={18} />}
        <Text
          {...selectedTextProps}
          style={[Layout.ml1, {height: 20}]}
          colour={textColour}
        >{text}</Text>
      </Pressable> 
    )
  }
}
