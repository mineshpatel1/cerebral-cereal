import React from 'react';
import { Dimensions } from 'react-native';
import { getUniqueId } from 'react-native-device-info';

import {
  Component, Container, DrawerMenu, Header, HorizontalMenu, TimerModal
} from 'cerebral-cereal-common';
import RecipesMenu from './menus/RecipesMenu';
import IngredientsMenu from './menus/IngredientsMenu';
import ShoppingListMenu from './menus/ShoppingListMenu';

const maxWidth = Dimensions.get('window').width;

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      showDrawer: false,
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { state, props } = this;
    const screens = [
      {title: 'Recipes', icon: 'utensils', element: (
        <RecipesMenu navigation={this.props.navigation} />
      )},
      {title: 'Shopping List', icon: 'shopping-cart', element: (
        <ShoppingListMenu navigation={this.props.navigation} />
      )},
      {title: 'Ingredients', icon: 'carrot', element: (
        <IngredientsMenu navigation={this.props.navigation} />
      )},
    ];

    const menuItems = [
      {label: 'Device ID', icon: 'carrot', onPress: () => console.log(getUniqueId())},
      {label: 'Settings', icon: 'cog', route: 'Settings'},
    ];

    return (
      <DrawerMenu
        title={"Info & Settings"}
        menu={menuItems}
        isOpen={state.showDrawer}
        navigation={props.navigation}
        onRequestClose={() => this.setState({showDrawer: false})}
      >
        <Header
          title={screens[this.state.index].title}
          link={{icon: 'bars', onPress: () => this.setState({showDrawer: true})}}
        />
        {/*
          Using dark background colour and light foreground so
          that the bottom of the iOS app matches the menu bar
        */}
        <Container colour={Colours.background}>
          <HorizontalMenu
            screens={screens} icons={screens.map(s => s.icon)}
            width={maxWidth}
            style={{backgroundColor: Colours.background}}
            onSelect={i => this.setState({index: i})}
            keyboardShouldPersistTaps="handled"
          />
        </Container>
      </DrawerMenu>
    )
  }
}

