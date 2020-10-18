import React from 'react';
import { View, TextInput as ReactTextInput } from 'react-native';

import { Component } from './Component';
import { Icon } from './Icon';
import { Text } from './Text';
import { Layout, StyleConstants } from '../styles';
import { Validators } from '../utils/Validators';

export class TextInput extends Component {
  static defaultProps = {
    label: null,
    value: null,
    colour: null,
    onChange: null,
    onSubmitEditing: null,
    placeholder: null,
    placeholderColour: null,
    icon: null,
    keyboardType: 'default',
    errorColour: null,
    validators: null,  // Array of val => {}
    style: null,
    height: StyleConstants.iconWidth,
  }

  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
    }
  }

  onChange = (val) => {
    const { onChange, validators } = this.props;
    const isValid = validators ? Validators.validate(val, validators) : true;
    onChange(val, isValid);
    this.setState({ isValid });
  }

  render() {
    const { Colours, Fonts } = this.getTheme();
    const { props, state } = this;
    let {
      label, value, colour, errorColour, icon, keyboardType,
      onChange, placeholder, placeholderColour, style,
      ...textInputProps
    } = props;

    colour = colour || Colours.foreground;
    placeholderColour = placeholderColour || Colours.disabled;
    errorColour = errorColour || Colours.error;
    const _colour = state.isValid ? colour : errorColour;
    const height = label ? props.height + 16 : props.height;

    let iconElement = (
      <View style={[Layout.col]}>
        <Icon icon={icon} colour={_colour} />
      </View>
    )

    return (
      <View style={[
        Layout.col, Layout.f1,
        {
          borderBottomWidth: 1,
          borderColor: _colour,
          height: height,
        },
        style,
      ]}>
        {label && <Text size={14}>{label + ':'}</Text>}
        <View style={[Layout.row, Layout.aCenter]}>
          <View style={[Layout.col, Layout.f1]}>
            <ReactTextInput
              style={[Fonts.normal, {color: _colour, height: StyleConstants.iconWidth}]}
              value={props.value}
              onChangeText={this.onChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              placeholderTextColor={placeholderColour}
              selectionColor={placeholderColour}
              {...textInputProps}
            />
          </View>
          {icon && iconElement}
        </View>
      </View>
    )
  }
}
