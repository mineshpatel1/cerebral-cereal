import React from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';

import { Component } from './Component';
import { Utils } from '../utils';

export class Spinner extends Component {
  static defaultProps = {
    colour: null,
    size: null,
    loading: false,
    animationDuration: 300,
    animated: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading,
      opacity: new Animated.Value(props.loading ? 1 : 0),
    }
  }

  toggle = callback => {
    Utils.animate(
      this.state.opacity,
      this.props.loading ? 1 : 0,
      {
        duration: this.props.animationDuration,
        callback,
      },
    )
  }

  componentDidUpdate(prevProps) {
    // Check and de-check element
    if (this.props.animated && this.props.loading !== prevProps.loading) {
      if (this.props.loading) {
        this.setState({loading: true}, this.toggle);
      } else {
        this.toggle(() => this.setState({loading: false}));
      }
    }
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props, state } = this;
    const colour = props.colour || Colours.primary;
    const ViewElement = props.animated ? Animated.View : View;
    const loading = props.animated ? state.loading : props.loading;
    const opacity = props.animated ? state.opacity : 1;

    return (
      <>
      {
        loading &&
        <ViewElement style={[Styles.screenCover, {opacity: opacity}]}>
          <View style={[Styles.screenCover, {opacity: 0.8, backgroundColor: Colours.black}]} />
          <ActivityIndicator size={this.props.size} color={colour} />
        </ViewElement>
      }
      </>
    )
  }
}