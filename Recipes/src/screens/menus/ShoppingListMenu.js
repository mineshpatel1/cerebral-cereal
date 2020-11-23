import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ScrollView, View } from 'react-native';

import {
  ChecklistItem, Collapsible, Component, PlainButton, RefreshControl,
  ScreenContainer, Layout,
} from 'cerebral-cereal-common';

import { addItems, removeItem, toggleItem } from '../../actions/ShoppingListActions';
import { locations } from '../../data';
import LocalUtils from '../../utils';
import IngredientTypeahead from '../../components/IngredientTypeahead';
import EditItemModal from '../../components/EditItemModal';

class ShoppingListMenu extends Component {
  static defaultProps = {
    navigation: null,
    showToast: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      shortlist: [],
      showTypeahead: false,
      collapsibles: {},
      testQuantity: 1,
      editModal: false,
      editItem: null,
      refreshing: false,
    }
  }

  itemInList = name => {
    const items = this.props.shoppingList.map(i => i.name.toLowerCase());
    return items.indexOf(name.toLowerCase()) > -1
  }

  addItem = (name, quantity=1, ingredient_id) => {
    if (this.itemInList(name)) return;  // Don't add the same item twice

    // If a user enters a value that is identical to a matching ingredient
    // assume that they mean the ingredient (ignoring case)
    if (!ingredient_id && this.typeahead.state.shortlist.length > 0) {
      const shortlistItem = this.typeahead.state.shortlist[0];
      if (shortlistItem.name.toLowerCase() == name.toLowerCase()) {
        ingredient_id = shortlistItem.ingredientId;
        name = shortlistItem.name;
      }
    }

    this.props.addItems([{name, quantity, ingredient_id}])
      .catch(err => {
        console.error(err);
        this.props.showToast(err.toString(), 'error');
      });
    this.typeahead.clearSearch();
  }

  onRefresh = () => {
    console.log('ShoppingList onRefresh');
  }

  onEditItem = item => {
    let editItem = this.state.editItem;
    editItem.name = item.name;
    editItem.quantity = item.quantity.toString();
    editItem.locationId = item.locationId;
    this.setState({ editItem });
  }

  closeModal = () => this.setState({editItem: null, editIndex: -1});

  getItemList = () => {
    const { Colours } = this.getTheme();
    const { props } = this;

    const sectionList = [];

    // Map Ingredient IDs to ingredient objects
    const shoppingList = props.shoppingList.map(item => {
      let match = props.ingredients.filter(i => i.id == item.ingredient_id);
      if (match.length > 0) item.ingredient = match[0];
      return item;
    });

    const locationMap = LocalUtils.mapItemsToLocations(shoppingList, locations);
    locationMap.forEach(lm => {
      let location = {id: -1, name: 'Unknown'};
      if (lm.locationId > -1) {
        const _location = locations.filter(l => l.id == lm.locationId)[0];
        location.id = lm.locationId;
        location.name = _location.formatName();
      }

      const itemList = [];
      lm.items.forEach((item) => {
        let name = item.quantity + ' x ' + item.name;
        if (item.ingredient && item.name == item.ingredient.name) {
          name = item.ingredient.formatQuantity(item.quantity);
        }
        item.locationId = location.id;

        itemList.push(
          <View
            key={item.index + item.name}
            style={[
              Layout.row, Layout.aCenter, Layout.px1,
              {justifyContent: 'space-between'},
            ]}
          >
            <ChecklistItem
              onPress={() => props.toggleItem(item.index)}
              checked={item.checked}
              text={name}
              textColour={Colours.foreground}
              checkColour={Colours.primary}
              selectedCheckColour={Colours.disabled}
              selectedTextColour={Colours.disabled}
              animationDuration={100}
              selectedTextProps={{strikethrough: true}}
            />
            <View style={Layout.row}>
              <PlainButton icon="pen" size={40} onPress={() => this.setState({editItem: item, editIndex: item.index})} />
              <PlainButton icon="times" size={40} onPress={() => props.removeItem(item.index)} />
            </View>
          </View>
        );
      });

      const allDone = lm.items.every(i => i.checked);
      sectionList.push(
        <Collapsible
          key={location.id}
          title={location.name}
          colour={allDone ? Colours.disabled : Colours.primary}
          height={(itemList.length * 40) + 16}
          collapsed={this.state.collapsibles[location.id]}
          onPress={() => {
            let collapsibles = this.state.collapsibles;
            collapsibles[location.id] = !collapsibles[location.id];
            this.setState({collapsibles});
          }}
        >
          <View style={Layout.py1}>
            {itemList}
          </View>
        </Collapsible>
      )
    });
    return sectionList;
  }

  render() {
    const { props, state } = this;
    return (
      <ScreenContainer style={Layout.px0}>
        <EditItemModal
          visible={state.editItem !== null}
          onRequestClose={this.closeModal}
          item={state.editItem}
          itemIndex={state.editIndex}
          onChange={this.onEditItem}
        />
        <View style={[Layout.f1]}>
          <IngredientTypeahead
            onSelect={this.addItem}
            placeholder="Add Item"
            overlayTop={50}
            style={[Layout.px2, Layout.mb2]}
            shoppingList={props.shoppingList}
            ingredients={props.ingredients}
            ref={x => this.typeahead = x}
          />
          <ScrollView
            refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={state.refreshing} />}
          >
            {this.getItemList()}
          </ScrollView>
        </View>
      </ScreenContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    shoppingList: state.shoppingList,
    ingredients: state.ingredients,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ addItems, removeItem, toggleItem }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListMenu);
