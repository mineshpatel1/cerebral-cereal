import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { PickerModal } from '../modals/PickerModal';
import { Text } from '../Text';
import { Layout } from '../../styles/Layout';

export class PickerInput extends Component {
  static defaultProps = {
    textLabel: null,
    value: null,
    pickerLabel: null,
    pickerChoices: null,
    pickerChoiceKeys: null,
    pickerChoiceValues: null,
    onChange: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      pickerModal: false,
    }
  }

  openPicker = () => {
    this.setState({pickerModal: true});
  }

  closeModal = val => {
    this.setState({pickerModal: false});
    this.props.onChange(val);
  }

  render() {
    const { Styles } = this.getTheme();
    const { props, state } = this;
    let value = props.value;

    // If an object is specified, use key/value pairs
    if (props.pickerChoiceKeys && props.pickerChoiceValues) {
      const key = props.pickerChoiceKeys.indexOf(props.value);
      value = props.pickerChoiceValues[key];
    }

    return (
      <View>
        <PickerModal
          title={props.pickerLabel}
          choices={props.pickerChoices}
          choiceKeys={props.pickerChoiceKeys}
          choiceValues={props.pickerChoiceValues}
          selected={props.value}
          visible={state.pickerModal}
          onSelect={this.closeModal}
        />
        {props.textLabel && <Text size={14} text={props.textLabel + ':'} />}
        <View style={Layout.row}>
          <Text
            text={value}
            onPress={this.openPicker}
            style={[
              Layout.f1, Layout.mt1, Layout.pl1,
              Styles.textInput,
            ]}
          />
        </View>
      </View>
    )
  }
}
