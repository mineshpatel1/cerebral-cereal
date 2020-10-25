import React from 'react';
import { Animated, Pressable, View } from 'react-native';

import { Component } from '../Component';
import { Icon } from '../Icon';
import { Layout, StyleConstants } from '../../styles';

export class IconSet extends Component {
  static defaultProps = {
    buttons: [],  // Array of {icon, onPress}
    selected: null,
    backgroundColour: null,
    colour: null,
    selectionColour: null,
    borderColour: null,
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const { selected} = props;
    const buttonElements = [];
    let selectedIndex = -1;

    // Default colour values
    const backgroundColour = props.backgroundColour || Colours.background;
    const colour = props.colour || Colours.disabled;
    const selectionColour = props.selectionColour || Colours.iconHighlight;
    const borderColour = props.borderColour || Colours.primary;

    props.buttons.forEach((button, i) => {
      if (i == selected) selectedIndex = i;
      let buttonColour = i == selected ? selectionColour : colour;
      let divider = i > 0 ? (
        <View key={'divider' + i} style={[
          {
            height: 24,
            backgroundColor: colour,
            width: 1,
          }
        ]}/>
      ) : null;

      buttonElements.push(
        <Pressable
          key={i} accessibilityLabel={button.label}
          onPress={button.onPress}
        >
           <View style={[Layout.row, Layout.center]}>
              {divider}
              <Icon
                colour={buttonColour}
                icon={button.icon}
                size={26}
                buttonProps={{activeOpacity: 1}}
                style={[
                  Layout.p2,
                  {
                    paddingLeft: StyleConstants.size2,
                    paddingRight: StyleConstants.size2,
                  }
                ]}
              />  
            </View>
        </Pressable>
      )
    });

    return (
      <View
        style={[
          {
            backgroundColor: backgroundColour,
            height: StyleConstants.iconWidth + StyleConstants.size2,
            borderTopWidth: 2, borderColor: borderColour,
          },
          Layout.center,
          Layout.row,
          Layout.center,
        ]}
      >
        <View style={[Layout.row]}>
          <Animated.View
            key="selector"
            style={[
            {
              backgroundColor: selectionColour,
              width: StyleConstants.iconWidth + StyleConstants.size2,
              height: 5,
              position: 'absolute',
              top: 0,
              left: props.indicatorPos,
            },
          ]}/>
          {buttonElements}
        </View>
      </View>
    )
  }
}
