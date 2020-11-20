import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import { Button, Component, ScreenContainer, Layout } from 'cerebral-cereal-common';

import SearchList from '../../components/SearchList';
import { setRecipes } from '../../actions/RecipeActions';
import { setIngredients } from '../../actions/IngredientActions';

class RecipesMenu extends Component {
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
      'Recipe',
      {
        headerOverride: item.name,
        recipe: item.id,
      },
    );
  }

  render() {
    const { props, state } = this;
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
        {
          props.recipes.length > 0 &&
          <SearchList
            items={props.recipes}
            onSelect={this.onSelect}
            showToast={props.showToast}
          />
        }
        {
          props.recipes.length == 0 &&
          <View style={[Layout.f1, Layout.p2, Layout.center]}>
            <Button label="Fetch Recipes" onPress={this.onRefresh} />
          </View>
        }
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
  bindActionCreators({ setRecipes, setIngredients }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(RecipesMenu);
