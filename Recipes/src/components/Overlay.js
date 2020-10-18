import React from 'react';
import { Animated } from 'react-native';

import { Component, Utils } from 'cerebral-cereal-common';

export class Overlay extends Component {
  static defaultProps = {
    visible: false,
    animationDuration: 300,
    elevation: 3,
    style: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(props.visible ? 1: 0),
    }
  }

  componentDidUpdate(prevProps) {
    // Check and de-check element
    if (this.props.visible !== prevProps.visible) {
      Utils.animate(
        this.state.opacity,
        this.props.visible ? 1 : 0,
        {
          duration: this.props.animationDuration,
        },
      )
    }
  }

  render() {
    const { props, state } = this;
    const { visible } = props;

    return (
      <Animated.View
        pointerEvents={visible ? 'auto': 'none'}
        style={[
          {
            opacity: state.opacity,
            elevation: props.elevation,
            zIndex: props.elevation,
          },
          props.style
        ]}
      >
        {this.props.children}
      </Animated.View>    
    )
  }
}
