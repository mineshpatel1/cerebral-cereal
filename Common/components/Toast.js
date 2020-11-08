import React from 'react';
import { Animated, Dimensions } from 'react-native';

import { Component } from './Component';
import { Text } from './Text';
import { Layout } from '../styles';
import { Utils } from '../utils/Utils';

const maxHeight = Dimensions.get('window').height;
export const TOAST_COLOURS = {
  info: 'primary',
  error: 'error',
  success: 'success',
}

export class Toast extends Component {
  static defaultProps = {
    animationDuration: 250,
    showTime: 2500,
    height: 60,
    onHide: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      colour: null,
      position: new Animated.Value(this.getHeight()),
      timeoutId: null,
    }
  }

  getHeight = () => {
    return maxHeight - (this.props.height + 25);
  }

  show = (message, mode='info') => {
    const { props, state } = this;
    const { Colours } = this.getTheme();

    this.setState(
      {message, colour: Colours[TOAST_COLOURS[mode]]},
      () => {
        Utils.animate(
          state.position, (maxHeight - 85),
          {
            duration: props.animationDuration,
            native: false,
            callback: () => this.setState(
              {timeoutId: setTimeout(this.hide, props.showTime)}
            )
          },
        )
      }
    )
  }

  hide = () => {
    const { props, state } = this;
    Utils.animate(
      state.position, maxHeight,
      {
        duration: props.animationDuration,
        native: false,
      }
    )
  }

  componentWillUnmount = () => {
    clearInterval(this.state.timeoutId);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;

    return (
      <Animated.View style={[
        Layout.p2, Layout.center,
        {
          backgroundColor: state.colour,
          position: 'absolute',
          top: state.position,
          width: '100%',
          height: props.height,
        }
      ]}>
        <Text colour={Colours.primaryContrast}>{state.message}</Text>
      </Animated.View>
    )
  }
}