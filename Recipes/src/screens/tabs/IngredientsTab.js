import React from 'react';
import { ScrollView, View } from 'react-native';

import {
  Component, ScreenContainer, Text,
  Layout, Utils,
} from 'cerebral-cereal-common';


import { ingredients, units } from '../../data';

export default class IngredientsTab extends Component {
  static defaultProps = {
    ingredients: [],
    servingSize: 4,
    baseServingSize: 4,
  }

  constructor(props) {
    super(props);
    props.ingredients.forEach(_i => {
      _i.ingredient = ingredients.filter(i => _i.ingredient_id == i.id)[0];
    });
  }

  render() {
    const { props } = this;
    const ingredientElements = [];
    const ratio = props.servingSize / props.baseServingSize;

    props.ingredients.forEach((ingredient, i) => {
      let _ingredient = ingredient.ingredient;

      const _quantity = Utils.round(ratio * ingredient.quantity);
      const unit = units.filter(u => u.id == _ingredient.unit_id)[0];
      const quantity = _quantity + unit.display;
      const name = _ingredient.formatPlural(_quantity);
      
      ingredientElements.push(
        <View key={i} style={[Layout.row, Layout.pd1]}>
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

