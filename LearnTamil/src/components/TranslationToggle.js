import React from 'react';
import { Component, SwitchInput } from 'cerebral-cereal-common';

export default class TranslationToggle extends Component {
  static defaultProps = {
    onChange: null,
  }

  render() {
    const { props } = this;
    return (
      <SwitchInput
        onToggle={props.onChange}
        value={props.value}
        labelTrue={'Tamil to English'}
        labelFalse={'English to Tamil'}
        accessibilityLabel={'Will swap translation direction.'}
      />
    );
  }
}
