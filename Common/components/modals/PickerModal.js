import React from 'react';
import { Animated, ScrollView, View } from 'react-native';

import { Component } from '../Component';
import { RadioButton } from '../inputs/RadioButton';
import { Modal } from './Modal';
import { Pressable } from '../buttons/Pressable';
import { Text } from '../Text';
import { Layout } from '../../styles';

export class PickerModal extends Component {
  static defaultProps = {
    title: null,
    selected: null,
    choices: null,
    choiceKeys: null,
    choiceValues: null,
    onSelect: () => {},
    visible: null,
    rippleColour: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      optionColour: new Animated.Value(0),
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const {
      choices, choiceKeys, choiceValues, title, selected, onSelect,
      visible, ...modalProps
    } = props;
    const rippleColour = props.rippleColour || Colours.primary;

    let _choiceKeys = choiceKeys || choices;
    let _choiceValues = choiceValues || choices;

    const choiceElements = []
    _choiceValues.forEach((choice, i) => {
      const colour = _choiceKeys[i] == selected ? Colours.foreground : Colours.disabled;
      choiceElements.push(
        <Pressable
          key={choice}
          backgroundColour={Colours.background}
          rippleColour={rippleColour}
          onPress={() => {onSelect(_choiceKeys[i])}}
          style={[Layout.row, Layout.pd1]}
        >
          <RadioButton
            selected={_choiceKeys[i] == selected}
          />
          <View style={[Layout.ml1, {marginTop: 2}]}>
            <Text colour={colour}>{choice}</Text>
          </View>
        </Pressable>
      );
    });

    const ViewElement = _choiceValues.length > 14 ? ScrollView : View;

    return (
      <Modal
        {...modalProps}
        visible={visible}
        onRequestClose={() => {onSelect(selected)}}
      >
        <View style={[
          Layout.pd1,
          {minWidth: 200},
        ]}>
          <View style={[
            Layout.pd1,
            {
              borderBottomWidth: 1,
              borderColor: Colours.foreground,
            }
          ]}>
            <Text bold upper size={14} align="center" colour={Colours.foreground}>{title}</Text>
          </View>
          
          <ViewElement style={[
            Layout.mt2,
            Layout.col,
            {width: '100%'},
          ]}>
            {choiceElements}
          </ViewElement>
        </View>
      </Modal>
    )
  }
}
