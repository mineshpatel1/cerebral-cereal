import React from 'react';
import { View, Pressable as ReactPressable } from 'react-native';

import { Component, Switch, Text, Layout } from 'cerebral-cereal-common';

export default class TranslationToggle extends Component {
  static defaultProps = {
    onChange: null,
    label: null,
  }

  render() {
    const { props } = this;
    const { Colours } = this.getTheme();

    const translationText = (
      props.value ?
      'Tamil to English' :
      'English to Tamil'
    );
    const accessibilityLabel = (
      translationText + ' selected.'
      + ' Will swap translation direction.'
    );

    return (
      <View style={[
        Layout.row, Layout.aCenter,
        Layout.mt2, Layout.mb1, Layout.pdb1,
        {
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: Colours.disabled,
        }
      ]}>
        <ReactPressable
          accessibilityLabel={accessibilityLabel}
          onPress={props.onChange}
        >
          <Text>{translationText}</Text>
        </ReactPressable>
        <Switch
          accessibilityLabel={accessibilityLabel}
          onValueChange={props.onChange}
          value={props.value}
        />
      </View>
    );
  }
}
