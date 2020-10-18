import React, { Component } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import { IconSet } from './IconSet';
import { TabSet } from './TabSet';
import { Layout, StyleConstants } from '../styles';

const maxWidth = Dimensions.get('window').width;

export class HorizontalMenu extends Component {
  static defaultProps = {
    screens: [],  // Array of {element}
    width: maxWidth,
    style: null,
    onSelect: null,
    icons: null,  // Will have an Icon Set at the bottom of the container
    tabs: null,  // Will have text tabs at the top of the container
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: 0,
      animateIcons: 100,
      indicatorPos: 0,
      freeze: false,
    }
  }

  selectMenu = i => {
    this.setState({selectedMenu: i, freeze: true}, () => {
      this.scrollMenu.scrollTo({x: i * this.props.width});
      if (this.props.onSelect) this.props.onSelect(i);
    });
  }

  dragMenu = e => {
    const { props, state } = this;
    const i = Math.round(e.nativeEvent.contentOffset.x / props.width);
    let newState = {indicatorPos: e.nativeEvent.contentOffset.x};

    if (i != state.selectedMenu && !state.freeze) {
      newState.selectedMenu = i;
      if (props.onSelect) props.onSelect(i);
    }
    this.setState(newState);
  }

  endScroll = () => {
    if (this.state.freeze) {
      this.setState({freeze: false});
    }
  }

  render() {
    const { props, state } = this;
    const { icons, screens, style, tabs, onSelect, width, ...scrollProps } = props;

    const _menuButtons = [];
    const _screens = [];
    screens.forEach((screen, i) => {
      let buttonProps = {onPress: () => { this.selectMenu(i); }};
      if (icons) buttonProps.icon = icons[i];
      if (tabs) buttonProps.text = tabs[i];

      _menuButtons.push(buttonProps);
      _screens.push((
        <View key={i}>{screen.element}</View>
      ));
    });

    return (
      <>
        {
          tabs &&
          <TabSet
            tabs={_menuButtons}
            selected={state.selectedMenu}
            indicatorPos={
              (state.indicatorPos / maxWidth) / _menuButtons.length * 100 + '%'
            }
          />
        }
        <View style={[Layout.f1, style]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            scrollEventThrottle={16}
            onScroll={this.dragMenu}
            onMomentumScrollEnd={this.endScroll}
            ref={(ref) => this.scrollMenu = ref}
            {...scrollProps}
          >
            {_screens.map(e => e)}
          </ScrollView>
        </View>
        {
          icons &&
          <IconSet
            buttons={_menuButtons}
            selected={this.state.selectedMenu}
            indicatorPos={
              (this.state.indicatorPos / maxWidth) *
              (StyleConstants.iconWidth + StyleConstants.size2)
            }
          />
        }
      </>
    )
  }
}
