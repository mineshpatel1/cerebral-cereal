import React from 'react';
import { Pressable as ReactPressable, View } from 'react-native';

import { Switch } from './Switch';
import { Text } from './Text';
import { Component } from './Component';
import { Layout } from '../styles/Layout';

export class SwitchInput extends Component {
  static defaultProps = {
    onToggle: null,
    value: null,
    labelTrue: 'True',
    labelFalse: 'False',
    accessibilityLabel: 'Will toggle value.',
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;
    const { Styles } = this.getTheme();
    const label = props.value ? props.labelTrue : props.labelFalse;
    const accessibilityLabel = label + '. ' + props.accessibilityLabel;

    return (
      <View style={Styles.switchRow}>
        <ReactPressable
          accessibilityLabel={accessibilityLabel}
          onPress={props.onToggle}
          style={Layout.f1}
        >
          <View>
            <Text>{label}</Text>
          </View>
        </ReactPressable>
        <Switch
          onValueChange={props.onToggle}
          value={props.value}
        />
      </View>
    );
  }
}