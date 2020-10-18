import React from 'react';
import { View } from 'react-native';

import { Component } from './Component';
import { Button } from './Button';
import { Modal } from './Modal';
import { Text } from './Text';
import { Layout } from '../styles';

export class ConfirmModal extends Component {
  static defaultProps = {
    message: "Are you sure?",
    confirmLabel: 'Yes',
    confirmIcon: 'check',
    onConfirm: null,
    cancelLabel: 'No',
    cancelIcon: 'times',
    onCancel: null,
    visible: null,
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const {
      message, cancelLabel, confirmLabel, cancelIcon, confirmIcon,
      onCancel, onConfirm, visible, ...modalProps
    } = props;

    return (
      <Modal
        {...modalProps}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={[
          Layout.center, Layout.pd2,
          {minWidth: 200},
        ]}>
          <Text align="center" colour={Colours.foreground}>{message}</Text>
          <View style={[
            Layout.mt2,
            Layout.row,
            {width: '100%', height: 42},
          ]}>
            <Button
              label={confirmLabel}
              icon={confirmIcon}
              colour={Colours.success}
              onPress={onConfirm}
              style={Layout.f1}
            />
            <Button
              label={cancelLabel}
              icon={cancelIcon}
              colour={Colours.error}
              onPress={onCancel}
              style={[Layout.f1, {marginLeft: 16}]}
            />
          </View>
        </View>
      </Modal>
    )
  }
}
