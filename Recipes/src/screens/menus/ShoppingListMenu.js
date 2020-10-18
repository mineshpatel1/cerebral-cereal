import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ScrollView, View } from 'react-native';

import {
  ChecklistItem, Collapsible, Component, PlainButton,
  ScreenContainer, Layout,
} from 'cerebral-cereal-common';

import { addItem, removeItem, toggleItem } from '../../actions/ShoppingListActions';
import { locations } from '../../data';
import { mapItemsToLocations } from '../../utils';
import IngredientTypeahead from '../../components/IngredientTypeahead';
import EditItemModal from '../../components/EditItemModal';

class ShoppingListMenu extends Component {
  static defaultProps = {
    navigation: null,
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
    }
  }

  itemInList = name => {
    const items = this.props.shoppingList.map(i => i.name.toLowerCase());
    return items.indexOf(name.toLowerCase()) > -1
  }

  addItem = (name, quantity=1, ingredientId) => {
    const { state } = this;
    if (this.itemInList(name)) return;  // Don't add the same item twice

    // If a user enters a value that is identical to a matching ingredient
    // assume that they mean the ingredient (ignoring case)
    if (!ingredientId && this.typeahead.state.shortlist.length > 0) {
      const shortlistItem = this.typeahead.state.shortlist[0];
      if (shortlistItem.name.toLowerCase() == name.toLowerCase()) {
        ingredientId = shortlistItem.ingredientId;
        name = shortlistItem.name;
      }
    }

    this.props.addItem(name, quantity, ingredientId);
    this.typeahead.clearSearch();
  }

  onEditItem = item => {
    let editItem = this.state.editItem;
    editItem.name = item.name;
    editItem.quantity = item.quantity.toString();
    editItem.locationId = item.locationId;
    this.setState({ editItem });
  }

  closeModal = () => this.setState({editItem: null});

  getItemList = () => {
    const { Colours } = this.getTheme();
    const { props } = this;

    const sectionList = [];
    const locationMap = mapItemsToLocations(props.shoppingList, locations);
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
              Layout.row, Layout.aCenter, Layout.pdx1,
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
              <PlainButton icon="pen" size={40} onPress={() => this.setState({editItem: item})} />
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
          <View style={Layout.pdy1}>
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
      <ScreenContainer style={Layout.pdx0}>
        <EditItemModal
          visible={state.editItem !== null}
          onRequestClose={this.closeModal}
          item={state.editItem}
          onChange={this.onEditItem}
        />
        <View style={[Layout.f1]}>
          <IngredientTypeahead
            onSelect={this.addItem}
            placeholder="Add Item"
            overlayTop={50}
            style={[Layout.pdx2, Layout.mb2]}
            shoppingList={props.shoppingList}
            ref={x => this.typeahead = x}
          />
          <ScrollView>
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
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ addItem, removeItem, toggleItem }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListMenu);
