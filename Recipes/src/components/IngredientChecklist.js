import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimensions, ScrollView, View } from 'react-native';

import {
    Button, ChecklistItem, Component, Icon, Modal, Text,
    Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { addItems } from '../actions/ShoppingListActions';
import { ingredients } from '../data';

const maxWidth = Dimensions.get('window').width - StyleConstants.size4;

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
      checked: this.getChecked(props),
    }
  }

  getChecked = props => {
    return this.ingredients.map(ingredientObj => {
      const ingredient = ingredientObj.ingredient
      const currentNum = this.getCurrentQuantity(ingredient, props.shoppingList);
      return (
        currentNum >= this.getNumItems(ingredientObj.quantity, ingredient.unit_size) ?
        false : true
      );
    });
  }

  getCurrentQuantity = (ingredient, shoppingList) => {
    let currentNum = 0;
    shoppingList.forEach(listItem => {
      if (listItem.ingredient && listItem.ingredient.id == ingredient.id) {
        currentNum = listItem.quantity;
        return currentNum;
      }
    });
    return currentNum;
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
    });
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

  componentDidUpdate = prevProps => {
    const { props } = this;
    if (props.visible != prevProps.visible && !props.visible) {
      this.setState({checked: this.getChecked(props)});
    }
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
        <View
          style={[
            Layout.p2, Layout.row, Layout.aCenter, Layout.jSpace,
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
            selectedTextProps={{}}
          />
          <Icon icon="shopping-cart" />
        </View>
        <ViewElement style={[{width: maxWidth}]}>
          {this.ingredients.map((ingredientObj, i) => {
            const ingredient = ingredientObj.ingredient;
            const numItems = this.getNumItems(ingredientObj.quantity, ingredient.unit_size);
            const checkStyle = i == (this.ingredients.length - 1) ? Layout.mb1 : null;
            const currentNum = this.getCurrentQuantity(ingredient, props.shoppingList);
            
            return (
              <View
                key={i}
                style={[
                  Layout.px2, Layout.mt1, Layout.row,
                  Layout.aCenter, Layout.jSpace, checkStyle,
                  {
                    marginRight: 4,
                  }
                ]}
              >
                <ChecklistItem
                  checked={state.checked[i]}
                  onPress={() => this.toggleItem(i)}
                  text={ingredient.formatQuantity(numItems)}
                  selectedTextProps={{}}
                />
                <Text>{currentNum}</Text>
              </View>              
            );
          })}
        </ViewElement>
        <Button
          colour={Colours.success}
          label="Add to List"
          icon="plus"
          style={[Layout.m2]}
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
