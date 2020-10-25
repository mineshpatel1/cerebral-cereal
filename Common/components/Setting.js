import React from 'react';
import { View } from 'react-native';

import { Component } from './Component';
import { Checkbox } from './inputs/Checkbox';
import { ListItem } from './lists/ListItem';
import { PickerModal } from './modals/PickerModal';
import { Text } from './Text';
import { Layout } from '../styles';

export class Setting extends Component {
  static defaultProps = {
    label: null,
    type: 'string',
    choices: [],
    description: null,
    value: null,
    onChange: () => {},
    topBorder: false,
    bottomBorder: true,
    backgroundColour: null,
    disabledColour: null,
    rippleColour: null,
    borderColour: null,
    textColour: null,
    descColour: null,
    animationDuration: 100,
    onPress: null,
    disabled: false,
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
    const { Colours } = this.getTheme();
    const { state, props } = this;

    const backgroundColour = props.backgroudColour || Colours.background;
    const disabledColour = props.disabledColour || Colours.disabled;
    const rippleColour = props.rippleColour || Colours.primary;
    const borderColour = props.borderColour || Colours.offGrey;
    const textColour = props.textColour || Colours.foreground;
    const descColour = props.descColour || Colours.disabled;

    const { choices, disabled, label, onChange, onPress, style, type, value } = this.props;
    const description = type == 'bool' ? props.description : value;
    const pressableProps = type == 'bool' ? {accessibilityState: {checked: value}} : null;

    return (
      <>
        <PickerModal
          title={label}
          choices={choices}
          selected={value}
          visible={state.pickerModal}
          onSelect={this.closeModal}
        />
        <ListItem
          disabled={disabled}
          borderColour={borderColour}
          backgroundColour={backgroundColour}
          rippleColour={rippleColour}
          pressableProps={pressableProps}
          style={style}
          onPress={() => {
            if (type == 'bool') {
              onChange(!value);
            } else if (choices.length == 0) {
              if (onPress) onPress();
              return;
            } else {
              this.openPicker();
            }
          }}
        >
          <View style={[Layout.f1, Layout.jCenter]}>
            <Text colour={textColour}>{label}</Text>
            <Text size={16} colour={descColour} style={Layout.mt1}>{description}</Text>
          </View>
          <View style={Layout.center}>
            {
              type == 'bool' &&
              <Checkbox
                checked={value}
                onPress={() => {onChange(!value)}}
              />
            }
          </View>
        </ListItem>
      </>
    )
  }
}