import React from 'react';
import { Dimensions } from 'react-native';

import { Component, Container, DrawerMenu, Header, HorizontalMenu } from 'cerebral-cereal-common';

import PractiseMenu from './menus/PractiseMenu';
import QuizMenu from './menus/QuizMenu';
import ProgressMenu from './menus/ProgressMenu';

const maxWidth = Dimensions.get('window').width;
const defaultTitle = 'Learn Tamil';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      showDrawer: false,
    }
  }

  navigate = route => {
    return () => {
      // This delay ensures the navigation animation is uninterrupted
      setTimeout(() => {
        this.setState({showDrawer: false});
      }, 300);
      this.props.navigation.navigate(route, {});
    }
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;

    const screens = [
      {title: defaultTitle, element: (
        <PractiseMenu navigation={props.navigation} />
      )},
      {title: 'Quiz Yourself', element: (
        <QuizMenu navigation={props.navigation} />
      )},
      {title: 'Progress', element: (
        <ProgressMenu navigation={props.navigation} />
      )},
    ];
    const icons = ['book-open', 'chalkboard-teacher', 'chart-bar', 'cog'];

    const menuItems = [
      {label: 'Tamil Alphabet', icon: 'book', route: 'Alphabet'},
      {label: 'Help', icon: 'question', route: 'Help'},
      {label: 'Settings', icon: 'cog', route: 'Settings'},
      {label: 'Acknowledgements', icon: 'users', route: 'Acknowledgements'},
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
          title={screens[state.index].title}
          link={{
            icon: 'bars', label: 'Settings Menu',
            onPress: () => this.setState({showDrawer: true})
          }}
        />
        {/*
          Using dark background colour and light foreground so
          that the bottom of the iOS app matches the menu bar
        */}
        <Container colour={Colours.background}>
          <HorizontalMenu
            screens={screens} icons={icons}
            width={maxWidth}
            style={{backgroundColor: Colours.background}}
            onSelect={i => this.setState({index: i})}
          />
        </Container>
      </DrawerMenu>
    )
  }
}

