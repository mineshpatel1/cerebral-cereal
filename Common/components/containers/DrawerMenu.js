import React from 'react';
import { View } from 'react-native';

import { Component } from '../Component';
import { Container } from './Container';
import { Drawer } from './Drawer';
import { Icon } from '../Icon';
import { ListItem } from '../lists/ListItem';
import { Text } from '../Text';
import { Layout } from '../../styles';

export class DrawerMenu extends Component {
  static defaultProps = {
    title: null,
    navigation: null,
    menu: null,  // {label, icon, route, onPress}
    isOpen: false,
    onRequestClose: false,
    headerColour: null,
    headerTextColour: null,
  }

  onPress = (route, onPress=null) => {
    return () => {
      if (route && !onPress) {
        // This delay ensures the navigation animation is uninterrupted
        setTimeout(() => {
          this.props.onRequestClose();
        }, 300);
        this.props.navigation.navigate(route, {});
      } else if (onPress) {
        onPress();
      }
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;

    const headerColour = props.headerColour || Colours.primary;
    const headerTextColour = props.headerTextColour || Colours.primaryContrast;

    const drawer = (
      <Container>
        <View style={[Layout.pd2, Layout.jCenter, {height: props.headerSize, backgroundColor: headerColour}]}>
          <Text bold display colour={headerTextColour}>{props.title}</Text>
        </View>
        {props.menu.map(item => (
          <ListItem key={item.label} onPress={this.onPress(item.route, item.onPress)}>
            <View style={[Layout.row, Layout.f1, Layout.aCenter, {justifyContent: 'space-between'}]}>
              <Text colour={Colours.foreground}>{item.label}</Text>
              {item.icon && <Icon icon={item.icon} />}
            </View>
          </ListItem>
        ))}
      </Container>
    );

    return (
      <Drawer
        drawer={drawer}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
      >
        {props.children}
      </Drawer>
    )
  }
}
