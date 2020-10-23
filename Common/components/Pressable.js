import React from 'react';
import { Animated, Platform, Pressable as ReactPressable, View } from 'react-native';

import { Component } from './Component';
import { ColourUtils } from '../utils/ColourUtils';
import { Utils } from '../utils/Utils';

const isAndroid = Platform.OS === 'android';

export class Pressable extends Component {
  static defaultProps = {
    highlight: true,
    backgroundColour: null,
    rippleColour: null,
    borderlessRipple: false,
    animationDuration: 100,
    containerStyle: null,
    fadeColour: null,
    customOption: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      pressableColour: new Animated.Value(0),
    }
  }

  // Android has the ripple feature, so this is not necessary
  highlightPress = value => {
    if (!isAndroid && this.props.highlight) {
      Utils.animate(
        this.state.pressableColour, value,
        {
          duration: this.props.animationDuration,
          native: false,
        }
      )
    }
  }

  componentDidUpdate = prevProps => {
    if (!isAndroid) {  // Reset button press state if overriding
      const { props } = this;
      if (props.fadeColour != prevProps.fadeColour) {
        this.setState({pressableColour: new Animated.Value(0)})
      }
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;
    let {
      animationDuration, backgroundColour, borderlessRipple, containerStyle,
      rippleColour, style, children, onPressIn, onPressOut, ...pressableProps
    } = props;
    backgroundColour = backgroundColour || Colours.background;
    rippleColour = rippleColour || Colours.offGrey;

    const ViewElement = isAndroid ? View : Animated.View;
    const androidRipple = props.highlight ? {color: rippleColour, borderless: borderlessRipple} : null;
    
    let fadeColour = isAndroid ? null : backgroundColour;
    if (!isAndroid && rippleColour) {  // iOS only
      if (props.fadeColour) {  // Override button colour
        fadeColour = props.fadeColour;
      } else {
        const opacityColour = ColourUtils.genOpacityColour(rippleColour, backgroundColour, 0.7);
        fadeColour = state.pressableColour.interpolate({
            inputRange: [0, 1],
            outputRange: [backgroundColour, opacityColour],
        });
      }
    }

    const viewBg = isAndroid ? {} : {backgroundColor: fadeColour};
    return (
      <ReactPressable
        android_ripple={androidRipple}
        onPressIn={() => {
          this.highlightPress(1);
          if (onPressIn) onPressIn();
        }}
        onPressOut={() => {
          this.highlightPress(0);
          if (onPressOut) onPressOut();
        }}
        style={containerStyle}
        {...pressableProps}
      >
        <ViewElement style={[viewBg, style]}>
            {children}
        </ViewElement>
      </ReactPressable>
    )
  }
}
