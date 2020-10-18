import React from 'react';
import { Animated, Text as ReactText } from 'react-native';

import { Component } from './Component';

export class Text extends Component {
  static defaultProps = {
    bold: false,
    underline: false,
    strikethrough: false,
    link: false,
    colour: null,
    display: false,
    size: 18,
    align: 'left',
    animated: false,
    text: null,
    upper: false,
    style: {},
    paddingAdjust: 3,
  }

  render() {
    const { Colours, Fonts, Styles } = this.getTheme();
    const { props } = this;
    let {
      align, animated, bold, colour, display, link, paddingAdjust,
      style, strikethrough, text, underline, upper, ...textProps
    } = props;

    colour = colour || Colours.foreground;
    let font = Fonts.normal;
    let size = props.size;
    if (bold) font = Fonts.bold;
    if (display) {
      font = Fonts.display;
      size = Fonts.display['fontSize'];
    }

    let _text = props.children;
    if (text) _text = text
    if (upper && _text) _text = _text.toUpperCase();

    const _underline = underline ? {textDecorationLine: 'underline'} : null;
    const _strikethrough = strikethrough ? {textDecorationLine: 'line-through'} : null;
    const _link = link ? Styles.link : null;
    const TextComponent = animated ? Animated.Text : ReactText;

    return (
      <TextComponent
        style={[
          font,
          {
            color: colour,
            fontSize: size,
            textAlign: align,
            includeFontPadding: false,
            textAlignVertical: 'center',
            paddingTop: paddingAdjust,
          },
          _link,
          _underline,
          _strikethrough,
          style
        ]}
        {...textProps}
      >
        {_text}
      </TextComponent>
    )
  }
}