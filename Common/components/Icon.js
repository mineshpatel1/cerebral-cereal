import React from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Component } from './Component';
import { Text } from './Text';

const BRANDS = ['google'];

export class Icon extends Component {
  static defaultProps = {
    style: null,
    colour: null,
    icon: null,
    size: 24,
    badge: null,
    buttonProps: null,
  }
  render() {
    const { Colours, Styles } = this.getTheme();
    const { props } = this;
    const colour = props.colour || Colours.foreground;
    const showBadge = props.badge > 0;

    const icon = BRANDS.indexOf(props.icon) > -1 ? ['fab', props.icon] : props.icon;

    return (
      <View style={[
        props.style,
      ]}>
        <FontAwesomeIcon icon={icon} size={props.size} color={colour} />
        {
          showBadge &&
          <View style={[Styles.badge, {
            position: 'absolute',
            top: -5,
            right: -5,
          }]}>
            <Text colour={Colours.foreground} size={10}>{props.badge}</Text>
          </View>
        }
      </View>
    )
  }
}
