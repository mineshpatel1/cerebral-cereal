import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View } from 'react-native';

import {
  Component, ScreenContainer, Text,
  Layout, Utils,
} from 'cerebral-cereal-common';


import { units } from '../../data';

class IngredientsTab extends Component {
  static defaultProps = {
    ingredients: [],
    servingSize: 4,
    baseServingSize: 4,
  }

  constructor(props) {
    super(props);
    props.ingredients.forEach(_i => {
      _i.ingredient = props.baseIngredients.filter(i => _i.ingredient_id == i.id)[0];
    });
  }

  render() {
    const { props } = this;
    const ingredientElements = [];
    const ratio = props.servingSize / props.baseServingSize;

    props.ingredients.forEach((ingredient, i) => {
      const _ingredient = ingredient.ingredient;

      const _quantity = Utils.round(ratio * ingredient.quantity);
      const unitId = ingredient.unit_id || _ingredient.unit_id;
      const unit = units.filter(u => u.id == unitId)[0];
      const quantity = _quantity + unit.formatPlural(_quantity);
      const name = _ingredient.formatPlural(_quantity);
      
      ingredientElements.push(
        <View key={i} style={[Layout.row, Layout.p1]}>
          <Text>{quantity + ' x ' + name}</Text>
        </View>
      );
    });
    
    return (
      <ScreenContainer>
        <ScrollView>
          {ingredientElements}
        </ScrollView>
      </ScreenContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    baseIngredients: state.ingredients,
  }
};

export default connect(mapStateToProps)(IngredientsTab);
