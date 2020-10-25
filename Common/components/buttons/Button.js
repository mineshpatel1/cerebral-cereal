import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Icon } from '../Icon';
import { Pressable } from './Pressable';
import { Text } from '../Text';
import { ColourUtils } from '../../utils/ColourUtils';
import { Layout, StyleConstants } from '../../styles';

export class Button extends Component {
  static defaultProps = {
    label: null,
    icon: null,
    onPress: null,
    onPressIn: null,
    onPressOut: null,
    colour: null,
    fontColour: null,
    rippleColour: null,
    height: StyleConstants.iconWidth,
    square: false,
    justify: 'center',
    disabled: false,
    disabledColour: null,
    textStyle: null,
    accessibilityLabel: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const {
      disabled, height, icon, justify, label, onPress,
      onPressIn, onPressOut, square, textStyle,
    } = props;

    // Default colour values
    const colour = props.colour || Colours.primary;
    const disabledColour = props.disabledColour || Colours.disabled;
    let fontColour = props.fontColour || Colours.primaryContrast;
    fontColour = disabled ? Colours.background : fontColour;

    const iconMargin = (icon && label) ? 8 : 0;
    const width = square ? StyleConstants.iconWidth : null;
    const rippleColour = ColourUtils.hexToRgba(
      props.rippleColour
      ? props.rippleColour
      : ColourUtils.alterBrightness(colour, -40)
    );
    
    const backgroundColour = ColourUtils.hexToRgba(
      disabled ? disabledColour : colour
    );

    return (
      <View
        style={[
          Layout.row,
          Layout.aCenter,
          Styles.roundCorner,
          {
            backgroundColor: backgroundColour,
            height: height,
            width: width,
          },
          this.props.style,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          backgroundColour={backgroundColour}
          rippleColour={rippleColour}
          borderlessRipple={true}
          disabled={disabled}
          containerStyle={Layout.f1}
          accessibilityLabel={props.accessibilityLabel}
          style={[
            Layout.f1,
            Layout.row,
            Layout.px2,
            Layout.aCenter,
            Styles.roundCorner,
            {
              justifyContent: justify,
              height: height,
            },
          ]}
        >
          { icon && <Icon style={{ marginRight: iconMargin }} colour={fontColour} icon={icon} size={18} /> }
          { label && <Text colour={fontColour} style={textStyle, {height: 20}}>{label}</Text> }
        </Pressable>
      </View>
    );
  }
}