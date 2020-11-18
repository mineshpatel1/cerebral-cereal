import React from 'react';
import { connect } from 'react-redux';
import { Image, View } from 'react-native'

import { Component, Container, Layout, Text } from 'cerebral-cereal-common';
import { ingredientCategories, locations, units } from '../data';

class Ingredient extends Component {
  constructor(props) {
    super(props);

    this.ingredient = props.ingredients.filter(i => i.id == this.props.route.params.ingredient)[0];
    this.category = ingredientCategories.filter(c => c.id == this.ingredient.category_id)[0];
    this.unit = units.filter(u => u.id == this.ingredient.unit_id)[0];

    if (this.ingredient.location_id) {
      this.location = locations.filter(l => l.id == this.ingredient.location_id)[0];
    }
    this.state = {}
  }

  render() {
    const F = props => <View style={Layout.f1}>{props.children}</View>;
    const T = props => <Text style={[Layout.mt2, props.style]} {...props}>{props.children}</Text>

    return (
      <Container style={Layout.p2}>
        <View style={[Layout.f1]}>
          {
            this.ingredient.image_url &&
            <View style={[Layout.row, Layout.center]}>
              <View style={
                {
                  borderRadius: 15,
                  overflow: 'hidden',
                }
              }>
                <Image
                  style={[{ 
                    width: 250,
                    aspectRatio: (this.ingredient.image_aspect_ratio || 1)
                  }]}
                  source={{uri: this.ingredient.image_url}}
                />
            </View>
          </View>
          }

          <View style={[Layout.row]}>
            <View style={{width: 150}}>
              <T bold>Category:</T>
              <T bold>Standard Size:</T>
              {
                this.location &&
                <T bold>Store Location:</T>
              }
            </View>
            <View style={Layout.f1}>
              <T>{this.category.name}</T>
              <T>{this.ingredient.unit_size + this.unit.display}</T>
              {
                this.location &&
                <T style={[Layout.mt2, {lineHeight: 24}]}>{this.location.formatName()}</T>
              }
            </View>
          </View>
        </View>        
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
  }
};

export default connect(mapStateToProps)(Ingredient);
