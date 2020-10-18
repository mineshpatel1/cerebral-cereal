import React from 'react';
import { SafeAreaView, View } from 'react-native';

import { Component } from './Component';
import { PlainButton } from './PlainButton';
import { Text } from './Text';
import { Layout, StyleConstants } from '../styles';

const BUTTON_SIZE = 36;
const ICON_SIZE = 20;

export class Header extends Component {
  static defaultProps = {
    height: StyleConstants.headerSize,
    title: null,
    nav: null,
    link: null,  // { icon, route, onPress }
    showBack: false,
  }

  render() {
    const { Colours } = this.getTheme();
    const { height, link, nav, showBack, title } = this.props;

    const backFn = nav ? nav.goBack : null;
    const buttonStyle = {marginTop: 4};

    const backButton = (
      <PlainButton
        icon="arrow-left"
        size={BUTTON_SIZE}
        textSize={ICON_SIZE}
        onPress={backFn}
        style={buttonStyle}
      />
    );

    let linkBtn;
    if (link) {
      linkBtn = (
        <View style={[
          Layout.row, Layout.f1, Layout.mr1,
          {justifyContent: 'flex-end'},
        ]}>
          <PlainButton
            icon={link.icon}
            size={BUTTON_SIZE}
            textSize={ICON_SIZE}
            style={buttonStyle}
            onPress={() => {
              if (link.onPress) {
                link.onPress();
              } else {
                nav.navigate(link.route, {});
              }
            }}
          />
        </View>
      )
    }

    const textIndent = showBack ? null : Layout.pdl2;
    const background = {backgroundColor: Colours.background};

    return (
      <SafeAreaView style={[background]}>
        <View style={[
          Layout.row, Layout.aCenter, background,
          {height: height, borderBottomWidth: 2, borderColor: Colours.primary},
        ]}>
          {
            showBack && backButton
          }
          <Text
            style={[textIndent]} display colour={Colours.foreground}
          >{title}</Text>
          {
            link && linkBtn
          }
        </View>
      </SafeAreaView>
    )
  }
}
