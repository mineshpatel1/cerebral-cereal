import React from 'react';
import { Button, Component, ScreenContainer, Layout } from 'cerebral-cereal-common';

import SearchList from '../../components/SearchList';
import { recipes } from '../../data';

class RecipesMenu extends Component {
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
      'Recipe',
      {
        headerOverride: item.name,
        recipe: item.id,
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
          items={recipes}
          onSelect={this.onSelect}
        />
      </ScreenContainer>
    )
  }
}

export default RecipesMenu;
