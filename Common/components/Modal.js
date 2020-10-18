import React, {  } from 'react';
import { Modal as ReactModal, Pressable as ReactPressable, View } from 'react-native';

import { Component } from './Component';

export class Modal extends Component {
  static defaultProps = {
    visible: false,
    animationType: "fade",
  }

  render() {
    const { Styles } = this.getTheme();
    const { props } = this;
    const { animationType, children, style, visible, ...modalProps } = props;

    return (
      <ReactModal
        {...modalProps}
        transparent={true}
        animationType={animationType}
        visible={visible}
      >
        <ReactPressable
          onPress={modalProps.onRequestClose}
          style={[Styles.modalBackground]}
        >
          <ReactPressable
            style={[Styles.modalView, style]}
          >
            {children}
          </ReactPressable>
        </ReactPressable>
      </ReactModal>
    )
  }
}
