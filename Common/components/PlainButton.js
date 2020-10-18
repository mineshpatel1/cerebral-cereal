import React from 'react';
import { View } from 'react-native';

import { Component } from './Component';
import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';
import { Layout } from '../styles/Layout';

export class PlainButton extends Component {
  static defaultProps = {
    size: 50,
    textSize: 24,
    borderRadius: null,
    text: null,
    icon: null,
    textColour: null,
    backgroundColour: null,
    onPress: null,
    style: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const borderRadius = props.borderRadius || (props.size / 2);
    const textColour = props.textColour || Colours.foreground;
    const backgroundColour = props.background || Colours.background;

    return (
      <View style={[
        Layout.center,
        {
          width: props.size,
          height: props.size,
          borderRadius: borderRadius,
          backgroundColor: backgroundColour,
        },
        props.style,
      ]}
      >
        <Pressable
          style={[Layout.pd1, {borderRadius: borderRadius}]}
          backgroundColour={backgroundColour}
          borderlessRipple={true}
          onPress={props.onPress}
        >
          {
            props.text &&
            <Text align="center" size={props.textSize} colour={textColour} style={{width: props.size / 2}}>{props.text}</Text>
          }
          {
            props.icon &&
            <Icon icon={props.icon} size={props.textSize} colour={textColour} />
          }
        </Pressable>
      </View>
    );
  }
}