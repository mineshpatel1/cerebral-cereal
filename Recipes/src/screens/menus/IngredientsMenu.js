import React from 'react';

import { Component, ScreenContainer, SelectableItem, Layout } from 'cerebral-cereal-common';

import SearchList from '../../components/SearchList';
import { ingredients } from '../../data';

export default class IngredientsMenu extends Component {
  static defaultProps = {
    navigation: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
    }
  }

  onSelect = item => {
    this.props.navigation.navigate(
      'Ingredient',
      {
        headerOverride: item.name,
        ingredient: item.id,
      },
    );
  }

  render() {
    const { Colours } = this.getTheme();
    return (
      <ScreenContainer style={[
        Layout.mt0, Layout.px0,
        {
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: Colours.primary,
        },
      ]}>
        <SearchList
          items={ingredients}
          onSelect={this.onSelect}
        />
      </ScreenContainer>
    )
  }
}

