import React from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Component } from './Component';
import { Text } from './Text';
import { Icon } from './Icon';
import { Utils } from '../utils/Utils';
import { Layout } from '../styles/Layout';
import { StyleConstants } from '../styles/StyleConstants';

export class Collapsible extends Component {
  static defaultProps = {
    colour: null,
    textColour: null,
    collapsed: false,
    title: null,
    onPress: null,
    animationDuration: 300,
    height: null,
    style: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(props.collapsed ? 0 : 1),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.collapsed !== prevProps.collapsed) {
      Utils.animate(
        this.state.height,
        this.props.collapsed ? 0 : 1,
        {
          duration: this.props.animationDuration,
          native: false,
        },
      )
    }
  }

  getContentHeight = event => {
    // This will get the height of the container based on the content after 
    // onLayout is called. It's a bit hacky but it works with static content.
    const { height } = event.nativeEvent.layout;
    if((height && height > this.height) || !this.height) this.height = height;
  }

  getHeightRange = () => {
    if (this.props.height !== null) {
      return [0, this.props.height];
    } if (this.height !== undefined) {
      return [0, this.height];
    } else {
      return ['0%', '100%'];
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;
    const icon = props.collapsed ? 'chevron-right' : 'chevron-down';
    const colour = props.colour ? props.colour : Colours.primary;
    const textColour = props.textColour ? props.textColour : Colours.primaryContrast;

    const dividerStyle = [
      Layout.row,
      Layout.aCenter,
      Layout.pdx2,
      {
        height: StyleConstants.headerSize,
        backgroundColor: colour,
        justifyContent: 'space-between',
      }
    ];

    return (
      <View style={props.style}>
        <Pressable onPress={props.onPress}>
          <View style={dividerStyle}>
            <Text colour={textColour}>{props.title}</Text>
            <Icon colour={textColour} icon={icon} />
          </View>
        </Pressable>
        <Animated.ScrollView
          onLayout={this.getContentHeight}
          style={[{
            height: state.height.interpolate({
                inputRange: [0, 1],
                outputRange: this.getHeightRange(),
            }),
          }]}
        >
          {props.children}
        </Animated.ScrollView>
      </View>
    )
  }
}