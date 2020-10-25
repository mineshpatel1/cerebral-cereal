import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ScrollView, View } from 'react-native';

import {
    Button, ChecklistItem, Component, Icon, Modal,
    Layout, Utils,
} from 'cerebral-cereal-common';

import { addItems } from '../actions/ShoppingListActions';
import { ingredients } from '../data';

class IngredientChecklist extends Component {
  static defaultProps = {
    onAdd: null,
    onRequestClose: null,
    visible: false,
    ingredients: [],
    servingRatio: 1,
    animationDuration: 150,
  }

  constructor(props) {
    super(props);
    this.ingredients = [];
    props.ingredients.forEach(_i => {
      this.ingredients.push(
        {
          ingredient: ingredients.filter(i => _i.ingredient_id == i.id)[0],
          quantity: _i.quantity,
        }
      );
    });

    this.state = {
      checked: this.ingredients.map(() => true),
    }
  }

  getNumItems = (quantity, unit_size) => {
    const _quantity = Utils.round(quantity * this.props.servingRatio);
    return Math.ceil(_quantity / unit_size);
  }

  toggleItem = i => {
    let checked = this.state.checked;
    checked[i] = !checked[i];
    this.setState({checked});
  }

  toggleAll = value => {
    this.setState({
      checked: this.ingredients.map(() => value),
    })
  }

  addToList = () => {
    const toAdd = [];
    this.ingredients.forEach((ingredientObj, i) => {
      const ingredient = ingredientObj.ingredient;
      const numItems = this.getNumItems(ingredientObj.quantity, ingredient.unit_size);

      if (this.state.checked[i]) {
        toAdd.push({
          name: ingredient.name,
          quantity: numItems,
          ingredient_id: ingredient.id,
        });
      }
    });
    this.props.addItems(toAdd);
    this.props.onRequestClose();
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;

    const ViewElement = this.ingredients.length > 17 ? ScrollView : View;
    const allSelected = state.checked.every(c => c);

    return (
      <Modal
        visible={props.visible}
        onRequestClose={props.onRequestClose}
      >
        <ViewElement style={[Layout.p2, {width: 300}]}>
          <View
            style={[
              Layout.pb1, Layout.pr1, Layout.mb1, Layout.row, Layout.aCenter, Layout.jSpace,
              {
                borderBottomColor: Colours.disabled,
                borderBottomWidth: 1,
              },
            ]}
          >
            <ChecklistItem
              checked={allSelected}
              onPress={() => this.toggleAll(!allSelected)}
              text={allSelected ? 'Select None' : 'Select All'}
            />
            {/* <Icon icon="shopping-cart" /> */}
          </View>
          {this.ingredients.map((ingredientObj, i) => {
            const ingredient = ingredientObj.ingredient;
            const numItems = this.getNumItems(ingredientObj.quantity, ingredient.unit_size);

            const checkStyle = i > 0 ? Layout.mt1 : null;
            return (
              <ChecklistItem
                key={i}
                checked={state.checked[i]}
                onPress={() => this.toggleItem(i)}
                text={ingredient.formatQuantity(numItems)}
                style={checkStyle}
                selectedTextProps={{}}
              />
            );
          })}
        </ViewElement>
        <Button
          colour={Colours.success}
          label="Add to List"
          icon="plus"
          style={[Layout.mx2, Layout.mb2]}
          onPress={this.addToList}
        />
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shoppingList: state.shoppingList,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ addItems }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(IngredientChecklist);
