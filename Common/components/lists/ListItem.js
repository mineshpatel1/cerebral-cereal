import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Pressable } from '../buttons/Pressable';
import { Layout } from '../../styles';

export class ListItem extends Component {
  static defaultProps = {
    topBorder: false,
    bottomBorder: true,
    backgroundColour: null,
    disabledColour: null,
    rippleColour: null,
    borderColour: null,
    onPress: null,
    style: null,
    pressableProps: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;

    const backgroundColour = props.backgroudColour || Colours.background;
    const disabledColour = props.disabledColour || Colours.disabled;
    const rippleColour = props.rippleColour || Colours.primary;
    const borderColour = props.borderColour || Colours.offGrey;

    const { disabled, pressableProps, onPress, style } = this.props;

    return (
      <Pressable
        rippleColour={rippleColour}
        onPress={onPress}
        backgroundColour={backgroundColour}
        style={[
          {
            borderTopWidth: props.topBorder ? 1 : 0,
            borderBottomWidth: props.bottomBorder ? 1 : 0,
            borderColor: borderColour,
          },
          style,
        ]}
        disabled={disabled}
        {...pressableProps}
      >
        <View style={[Layout.p2, Layout.row, {backgroundColor: disabled ? disabledColour : null}]}>
          {props.children}
        </View>
      </Pressable>
    )
  }
}