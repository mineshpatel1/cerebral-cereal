import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Component, ScreenContainer, Layout } from 'cerebral-cereal-common';

import SearchList from '../../components/SearchList';

class IngredientsMenu extends Component {
  static defaultProps = {
    navigation: null,
    showToast: null,
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
    const { props } = this;
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
          items={props.ingredients}
          onSelect={this.onSelect}
          showToast={props.showToast}
        />
      </ScreenContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
    ingredients: state.ingredients,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsMenu);
