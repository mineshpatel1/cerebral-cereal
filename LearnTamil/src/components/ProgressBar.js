import React from 'react';
import { Animated, View } from 'react-native';

import {
  Component, Pressable, PlainButton, Text,
  Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

export default class ProgressBar extends Component {
  static defaultProps = {
    maxWidth: null,
    category: null,
    categoryProgress: null,
    showText: true,
    onPress: null,
    animationDuration: 200,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(0),
    }
  }

  showText = value => {
    const { props } = this;
    if (props.categoryProgress && props.onPress) {
      props.onPress(props.category.id, value);
    }
  }

  componentDidUpdate = prevProps => {
    const { props } = this;
    if (props.showText != prevProps.showText) {
      Utils.animate(
        this.state.width, props.showText ? 1 : 0,
        {
          duration: props.animationDuration,
          native: false,
        },
      );
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const category = props.category;
    const catProgress = props.categoryProgress;
    const maxWidth = props.maxWidth;
    const rowStyle = [Layout.row, Layout.mt2, Layout.aCenter];

    const catSuccess = catProgress ? catProgress.correct / catProgress.attempted : 0;
    const width1 = Math.round(catSuccess * 100);
    const width2 = Math.round((1 - catSuccess) * 100);
    const pctText = catProgress ? width1 + '%' : '';

    const numAttempts = catProgress ? catProgress.correct + '/' + catProgress.attempted : null
    const progressColour = catProgress ? Colours.primary : Colours.background;
    const barColour = catProgress ? Colours.offGrey : Colours.background;
    const maxLabelWidth = maxWidth - ((StyleConstants.iconWidth * 2) + 32 + 20);
    const labelWidth = (
      catProgress ?
      this.state.width.interpolate({
        inputRange: [0, 1],
        outputRange: [0, maxLabelWidth],  // Should be exactly the distance
      }) : maxLabelWidth
    );

    return (
      <View key={category.id} style={[Layout.row, Layout.center, {height: StyleConstants.iconWidth}]}>
        <View style={[Layout.col]}>
          <View style={rowStyle}>
            <PlainButton
              size={40} textSize={20}
              accessibilityLabel={category.name}
              icon={category.icon} style={Layout.mr2}
              onPress={() => this.showText(!props.showText)}
            />
            <Pressable
              highlight={false}
              backgroundColour={Colours.background}
              onPress={() => this.showText(false)}
            >
              <Animated.View style={[
                Layout.row,
                Layout.aCenter,
                {
                  height: 24,
                  width: labelWidth,
                }
              ]}>
                <View style={[Layout.row, {width: maxLabelWidth}]}>
                  <Text style={Layout.mr1}>{category.name}</Text>
                  <Text style={[Layout.f1, Layout.mr1]} align="right">{numAttempts}</Text>
                </View>
              </Animated.View>
            </Pressable>
          </View>
        </View>
        <View style={[Layout.col, Layout.f1]}>
          <Pressable
            highlight={false}
            accessibilityLabel={category.name + ' ' + numAttempts}
            backgroundColour={Colours.background}
            onPress={() => this.showText(true)}
          >
            <View style={rowStyle}>
              <View style={[{width: width1 + '%', height: 24, backgroundColor: progressColour} ]}/>
              <View style={[{width: width2 + '%', height: 24, backgroundColor: barColour} ]}/>
            </View>              
          </Pressable>
        </View>
        <View style={[Layout.col, {width: 48, alignItems: 'flex-end'}]}>
          <View style={rowStyle}>
            <Text align="right" style={{width: 48}}>{pctText}</Text>
          </View>
        </View>
      </View>
    )
  }
}
