import React from 'react';
import { Animated, Pressable, View } from 'react-native';

import {
  Button, Component, Text, Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { animationDuration } from '../config';

export default class QuizOption extends Component {
  static defaultProps = {
    phrase: null,
    onPress: null,
    colour: null,
    highlight: null,
    height: StyleConstants.iconWidth * 2,
    borderColour: null,
    textColour: null,
    textHighlight: null,
    duration: animationDuration,
    onPlay: null,
    original: true,
    style: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      colour: new Animated.Value(0),
      borderColour: props.borderColour,
    }
  }

  getHighlight = () => this.props.highlight || this.getTheme().Colours.primary;

  reset = () => {
    Utils.animate(
      this.state.colour, 0,
      {
        duration: 0,
        native: false,
      }
    );
    this.setState({borderColour: this.props.borderColour});
  }

  highlight = () => {
    Utils.animate(
      this.state.colour, 1,
      {
        duration: this.props.duration,
        native: false,
      }
    );
    this.setState({borderColour: this.getHighlight()});
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { state, props } = this;
    const text = props.original ? props.phrase.original : props.phrase.translation;
    const script = !props.original ? props.phrase.script : null;

    const colour = props.colour || Colours.background;
    const _textColour = props.textColour || Colours.foreground;
    const textHighlight = props.textHighlight || Colours.primaryContrast;
    const borderColour = state.borderColour || Colours.offGrey;
    
    const textColour = state.colour.interpolate({
      inputRange: [0, 1],
      outputRange: [_textColour, textHighlight]
    });

    return (
      <View style={[Layout.row, Layout.aCenter]}>
        <Pressable
          onPress={props.onPress}
          style={Layout.f1}
        >
          <Animated.View
            style={[
              Layout.mt2,
              Styles.button,
              {
                backgroundColor: state.colour.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colour, this.getHighlight()]
                }),
                minHeight: props.height,
                borderWidth: 1,
                borderColor: borderColour,
              },
              props.style,
            ]}
          >
            <View style={[Layout.col, Layout.center]}>
              <Text align="center" bold animated colour={textColour}>
                {text}
              </Text>
              {
                !props.original &&
                <Text align="center" bold animated colour={textColour} style={Layout.mt1}>
                  {script}
                </Text>
              }
            </View>
          </Animated.View>
        </Pressable>
        {
          !props.original &&
          <Button
            square icon="volume-up"
            accessibilityLabel="Play Option"
            onPress={props.onPlay}
            colour={Colours.primary}
            fontColour={Colours.primaryContrast}
            style={[Layout.ml1, Layout.mt1]}
          />
        }
      </View>
    )
  }
}
