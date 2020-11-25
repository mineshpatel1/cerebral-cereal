import Api from '../api';
import {
  ADD_ITEMS, INIT_SHOPPING_LIST, SET_SHOPPING_LIST, REMOVE_ITEM, TOGGLE_ITEM, UPDATE_ITEM,
} from './types';

const parseNewItem = (name, quantity, ingredient_id) => {
  let newItem = {
    name: name,
    quantity: quantity,
    ingredient_id: ingredient_id,
    location_id: null,
    checked: false,
  }
  return newItem;
}

export const initShoppingList = shoppingList => ({
  type: INIT_SHOPPING_LIST,
  shoppingList,
});

export const setShoppingList = shoppingList => ({
  type: SET_SHOPPING_LIST,
  shoppingList,
});

export const addItems = _items => {
  return _addItems = async dispatch => {
    const items = _items.map(item => {
      return parseNewItem(item.name, item.quantity, item.ingredient_id);
    });

    await Api.addItems(items);
    dispatch({ type: ADD_ITEMS, items });
  }
}

export const toggleItem = (itemId, checked) => {
  return _toggleItem = async dispatch => {
    await Api.toggleItem(itemId, checked);
    dispatch({ type: TOGGLE_ITEM, itemId, checked });
  }
}

// export const updateItem = (itemId, item) => {
//   return _updateItem = async dispatch => {
//     await Api.
//   }
// }

export const removeItem = itemId => {
  return _removeItem = async dispatch => {
    await Api.removeItem(itemId);
    dispatch({ type: REMOVE_ITEM, itemId });
  }
}

export const updateItem = (index, item) => ({
  type: UPDATE_ITEM,
  index,
  item,
});

