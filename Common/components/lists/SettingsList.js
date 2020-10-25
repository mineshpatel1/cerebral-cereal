import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Setting } from '../Setting';
import { Layout } from '../../styles/Layout'
import { Utils } from '../../utils/Utils';

export class SettingsList extends Component {
  static defaultProps = {
    settings: null,
    defaultSettings: null,
    onUpdate: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      fields: this.parseFields(),
      customCheckbox: false,
      pickerModal: false,
      pickerChoice: 15,
    }
  }

  parseFields = () => {
    const { props } = this;
    return Object.keys(props.defaultSettings).reduce((map, field) => {
        const fieldSpec = props.defaultSettings[field];
        const valueType = fieldSpec.type == 'bool' ? 'bool' : 'string';
        map[field] = {
          value: Utils.parseValue(props.settings[field], valueType),
          isValid: true,
          ...fieldSpec,
        };
        return map;
    }, {});
  }

  updateField = (field, value, isValid) => {
    const fields = this.state.fields;
    fields[field].value = value;
    fields[field].isValid = isValid;
    this.setState({ fields });
    if (this.props.onUpdate) this.props.onUpdate(field, value, fields);
  }

  render() {
    const fieldElements = [];
    const fieldObjs = this.parseFields();
    
    Object.keys(fieldObjs).map(fieldId => {
      const field = fieldObjs[fieldId];
      fieldElements.push(
        <Setting
          key={fieldId}
          label={field.label}
          description={field.description}
          type={field.type}
          choices={field.choices}
          value={field.value}
          onChange={value => this.updateField(fieldId, value, true)}
          onPress={field.onPress}
          disabled={field.disabled}
        />
      );
    });

    return (
      <View style={[Layout.f1, Layout.col]}>
        {fieldElements}
      </View>
    )
  }
}

