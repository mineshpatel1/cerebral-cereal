import React from 'react';
import { View } from 'react-native';

import { Component } from './Component';
import { Text } from './Text';
import { Utils } from '../utils/Utils';

export class Timer extends Component {
  static defaultProps = {
    length: null,  // Seconds
    interval: 1,  // Seconds
    auto: true,
    onFinish: null,
    onTick: null,
    timeLeft: null,
    hidden: false,
    style: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.timeLeft || props.length * 1000,
      timeElapsed: 0,
      timerId: null,
      pauseTime: null,
      prevTime: null,
      playing: props.auto,
    };
  }

  tick = (callback) => {
    const { props, state } = this;
    const currentTime = Date.now();

    let diff;
    if (!state.pauseTime) {
      diff = state.prevTime ? currentTime - state.prevTime : 0;
    } else {
      diff = state.prevTime ? state.pauseTime - state.prevTime: 0;
    }
    const timeElapsed = state.timeElapsed + diff;
    const timeLeft = Math.max(state.timeLeft - diff, 0);

    const interval = props.interval * 1000;
    const timeout = interval - (timeElapsed % interval);
    const finished = timeLeft <= 0;

    if (this.mounted) {
      if (props.onTick) props.onTick(timeLeft);
      this.setState({
        timeoutId: finished ? null : setTimeout(this.tick, timeout),
        prevTime: currentTime,
        timeLeft: timeLeft,
        timeElapsed: timeElapsed,
        pauseTime: null,
        playing: true,
      }, callback);

      if (finished && props.onFinish) props.onFinish();
    }
  }

  start(callback) {
    this.tick(callback);
  }

  stop(callback) {
    clearInterval(this.state.timeoutId);
    this.setState({pauseTime: Date.now(), playing: false}, callback);
  }

  reset(callback) {
    let { props } = this;
    clearInterval(this.state.timeoutId);
    this.setState({
      timeLeft: props.length * 1000,  // Time in milliseconds
      timeElapsed: 0,
      prevTime: null,
      timeoutId: null,
      playing: false,
    }, callback);
  }

  restart() {
    this.reset();
    this.start();
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.auto) this.tick();
  }

  componentWillUnmount() {
    clearInterval(this.state.timeoutId);
    this.mounted = false;
  }

  componentDidUpdate = prevProps => {
    const { props } = this;
    if (
      prevProps.timeLeft !== undefined && 
      props.timeLeft !== undefined &&
      prevProps.timeLeft !== props.timeLeft
    ) {
      this.setState({timeLeft: props.timeLeft});
    }
  }

  render() {
    return (
      <View>
        {
          !this.props.hidden &&
          <Text style={this.props.style}>{Utils.displayTime(this.state.timeLeft)}</Text>
        }
      </View>
    )
  }
}