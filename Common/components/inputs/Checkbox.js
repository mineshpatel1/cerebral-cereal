import React from 'react';
import { Animated, Pressable as ReactPressable } from 'react-native';

import { Component } from '../Component';
import { Icon } from '../Icon';
import { Utils } from '../../utils/Utils';

export class Checkbox extends Component {
  static defaultProps = {
    checked: false,
    colour: null,
    selectedColour: null,
    iconColour: null,
    onPress: null,
    animationDuration: 150,
  }

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(props.checked ? 1: 0),
    }
  }

  componentDidUpdate(prevProps) {
    // Check and de-check element
    if (this.props.checked !== prevProps.checked) {
      Utils.animate(
        this.state.opacity,
        this.props.checked ? 1 : 0,
        {
          duration: this.props.animationDuration,
        },
      )
    }
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const { onPress, checked } = props;

    // Default colour values
    const _colour = props.colour || Colours.disabled;
    const selectedColour = props.selectedColour || Colours.primary;
    const iconColour = props.iconColour || Colours.primaryContrast;

    const colour = checked ? selectedColour : _colour;

    return (
      <ReactPressable
        onPress={onPress}
        accessibilityState={{checked}}
        style={[
          Styles.checkbox,
          {
            borderWidth: 2,
            borderColor: colour,
          }
        ]}
      >
        <Animated.View
          style={[
            Styles.checkbox,
            {
              backgroundColor: colour,
              opacity: this.state.opacity,
            }
          ]}
        >
          {checked && <Icon icon="check" colour={iconColour} size={14} />}
        </Animated.View>
      </ReactPressable>      
    )
  }
}
