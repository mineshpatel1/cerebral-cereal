import React from 'react';
import { View } from 'react-native';

import { Button } from '../buttons/Button';
import { Component } from '../Component';
import { Modal } from './Modal';
import { PlainButton } from '../buttons/PlainButton';
import { Text } from '../Text';
import { Layout } from '../../styles/Layout';

const TIMER_MATCH = /(\d\d)(\d\d)(\d\d)/;

export class TimerModal extends Component {
  static defaultProps = {
    onConfirm: null,
    onCancel: null,
    visible: null,
    width: 300,
  }

  constructor(props) {
    super(props);
    this.state = {
      numSeconds: 0,
      timerStr: '',
    }
  }

  backspace = () => {
    let timerStr = this.state.timerStr;
    if (timerStr.length == 0) return;
    this.setState({timerStr: timerStr.substr(0, timerStr.length - 1)});
  }

  appendTimer = digit => {
    let timerStr = this.state.timerStr;
    if (timerStr.length == 6) return;
    if (timerStr.length == 0 && digit == 0) return ;
    
    timerStr += digit.toString();
    this.setState({ timerStr });
  }

  formatStr = () => this.state.timerStr.padStart(6, '0');
  getHours = () => this.formatStr().match(TIMER_MATCH)[1];
  getMinutes = () => this.formatStr().match(TIMER_MATCH)[2];
  getSeconds = () => this.formatStr().match(TIMER_MATCH)[3];

  getNumSeconds = () => {
    let hours = parseInt(this.getHours());
    let minutes = (hours * 60) + parseInt(this.getMinutes());
    return (minutes * 60) + parseInt(this.getSeconds());
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const {
      onCancel, onConfirm, visible, Xwidth, ...modalProps
    } = props;
    const width = props.width;

    const Time = props => (
      <View style={[Layout.f1, Layout.center]}>
        <Text
          size={32} align="center"
          colour={Colours.foreground}
        >
          {props.text}
        </Text>
      </View>
    );

    const Digit = props => (
      <View style={[Layout.f1, Layout.center]}>
        <PlainButton
          text={props.digit.toString()}
          onPress={() => this.appendTimer(props.digit)}
        />
      </View>
    );

    return (
      <Modal
        {...modalProps}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={[Layout.center, Layout.py2, {width: width}]}>
          <View style={[
            Layout.row, Layout.pb1, Layout.px2, Layout.mb2, Layout.center,
            {
              borderBottomWidth: 1,
              borderColor: Colours.offGrey,
              width: '100%',
            },
          ]}>
            <Time text={this.getHours() + 'h'} />
            <Time text={this.getMinutes() + 'm'} />
            <Time text={this.getSeconds() + 's'} />
            <PlainButton 
              icon="backspace"
              onPress={this.backspace}
            />
          </View>                 
          <View style={[Layout.column, {width: '80%'}]}>
            <View style={[Layout.row, Layout.mb1]}>
              <Digit digit={1} />
              <Digit digit={2} />
              <Digit digit={3} />
            </View>
            <View style={[Layout.row, Layout.mb1]}>
              <Digit digit={4} />
              <Digit digit={5} />
              <Digit digit={6} />
            </View>
            <View style={[Layout.row, Layout.mb1]}>
              <Digit digit={7} />
              <Digit digit={8} />
              <Digit digit={9} />
            </View>
            <View style={[Layout.row, Layout.mb2]}>
              <Digit digit={0} />
            </View>
          </View>
          <Button
            style={{width: '80%'}}
            label="Confirm" icon="check"
            onPress={() => props.onConfirm(this.getNumSeconds())}
            disabled={this.state.timerStr.length == 0}
          />
        </View>
      </Modal>
    )
  }
}
