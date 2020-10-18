import React from 'react';
import { View } from 'react-native';

import { Component, Pressable, Text, TextInput, Layout, Utils } from 'cerebral-cereal-common';
import { ingredients } from '../data';
import { parseQuantity } from '../utils';
import { Overlay } from './Overlay';

export default class IngredientTypeahead extends Component {
  static defaultProps = {
    onSelect: null,
    overlayTop: 0,
    overlayLeft: 0,
    overlayBackground: null,
    rippleColour: null,
    placeholder: 'Ingredient',
    shoppingList: [],
    style: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      showTypeahead: false,
      shortlist: [],
    }
  }

  clearSearch = () => this.itemSearch(null);

  itemInList = name => {
    const items = this.props.shoppingList.map(i => i.name.toLowerCase());
    return items.indexOf(name.toLowerCase()) > -1
  }

  itemSearch = value => {
    const shortlist = this.getShortlist(value);
    let newState = {
      search: value,
      showTypeahead: shortlist.length > 0,
    }

    // This ensures the typeahead still has values when it fades out
    if (shortlist.length > 0) newState.shortlist = shortlist;
    this.setState(newState);
  }

  getShortlist = searchTerm => {
    let shortlist = [];
    const {name, quantity} = parseQuantity(searchTerm);

    if (name && name.length >= 2) {
      ingredients.forEach(ingredient => {
        const ingredientName = ingredient.name.toLowerCase();
        const search = name.toLowerCase()
        if (
          ingredientName.indexOf(search) > -1 &&  // Name matches
          !this.itemInList(ingredientName)  // Item is not already in the list
        ) {
          shortlist.push({
            name: ingredient.name,
            ingredientId: ingredient.id,
            distance: Utils.getEditDistance(search, ingredientName),
            quantity,
          });
        }
      });
    }
    return Utils.sortByKey(shortlist, 'distance');
  }

  onSelect = (name, quantity, ingredientId) => {
    if (this.props.onSelect) this.props.onSelect(name, quantity, ingredientId);
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props, state } = this;

    const overlayBackground = props.overlayBackground || Colours.offGrey;
    const rippleColour = props.rippleColour || Colours.background;

    return (
      <>
        <View style={[Layout.row, props.style]}>
          <TextInput
            placeholder={props.placeholder}
            value={state.search}
            onChange={this.itemSearch}
            onEndEditing={this.clearSearch}
            onSubmitEditing={({ nativeEvent }) => {
              const {name, quantity} = parseQuantity(nativeEvent.text);
              this.onSelect(name, quantity)
            }}
          />
        </View>
        <Overlay
          visible={state.showTypeahead}
          style={[
            Layout.pdx2,
            {
              position: 'absolute',
              width: '100%',
              top: props.overlayTop,
              left: props.overlayLeft,
            },
          ]}
        >
          <View style={Styles.overlay}>
            {state.shortlist.map((item) => (
              <Pressable
                key={item.name}
                backgroundColour={overlayBackground}
                rippleColour={rippleColour}
                onPress={() => this.onSelect(item.name, item.quantity, item.ingredientId)}
                style={Layout.pd1}
              >
                <Text text={item.name} />
              </Pressable>
            ))}
          </View>
        </Overlay>
      </>
    )
  }
}
