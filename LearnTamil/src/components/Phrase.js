import React from 'react';
import { Animated, View } from 'react-native';

import { Button, Component, Text, Layout } from 'cerebral-cereal-common';

export default class Phrase extends Component {
  static defaultProps = {
    phrase: null,
    disabledColour: null,
    colour: null,
    iconColour: null,
    animationDuration: 300,
    isTranslation: true,
    onPress: null,
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const disabledColour = props.disabledColour || Colours.primary;
    const colour = props.colour || Colours.primaryContrast;
    const iconColour = props.iconColour || Colours.primary;

    let phraseText = " ";
    let phraseScript = props.isTranslation ? " " : null;
    if (props.phrase) {
      phraseText = props.isTranslation ? props.phrase.translation : props.phrase.original;
      if (props.isTranslation && props.phrase.script) phraseScript = props.phrase.script;
    }

    return (
      <Animated.View style={Layout.f1}>
        <View style={[
          Layout.row, Layout.center,
        ]}>
          <View style={[Layout.col, Layout.f3]}>
            <Text colour={colour} style={Layout.aCenter} bold>{phraseText}</Text>
            {
              phraseScript &&  // TODO: Enable this when all phrases have tamil script
              <Text colour={colour} style={[Layout.aCenter, Layout.mt1]} bold>{phraseScript}</Text>
            }
          </View>
          <View style={[Layout.col, Styles.iconWidth]}>
            {
              props.isTranslation &&
              <Button
                square icon="volume-up"
                onPress={props.onPress}
                colour={colour}
                rippleColour={Colours.primary}
                fontColour={iconColour}
                disabled={!props.phrase}
                disabledColour={disabledColour}
              />
            }
          </View>
        </View>
      </Animated.View>
    )
  }
}
