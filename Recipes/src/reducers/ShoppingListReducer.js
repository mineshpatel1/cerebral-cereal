import AsyncStorage from '@react-native-community/async-storage';
import { Utils } from 'cerebral-cereal-common';
import { ADD_ITEM, ADD_ITEMS, INIT_SHOPPING_LIST, REMOVE_ITEM, TOGGLE_ITEM } from '../actions/types';

const INITIAL_STATE = [];

const parseItem = (name, quantity, ingredient_id) => {
  let newItem = {
    name: name,
    quantity: quantity,
    ingredient_id: ingredient_id,
    location_id: null,
    checked: false,
  }
  return newItem;
}

const updateList = (list, item) => {
  updateItem = (oldItem, newItem) => {
    oldItem.quantity += newItem.quantity;
    oldItem.checked = false;
  }

  let updated = false;
  list.forEach(l => {
    if (l.ingredient && item.ingredient_id) {
      if (l.ingredient.id == item.ingredient_id) {
        updateItem(l, item);
        updated = true;
      }
    } else if (l.name == item.name) {
      updateItem(l, item);
      updated = true;
    }
  });

  if (!updated) list.push(item);
  return list;
}

const save = shoppingList => {
  AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

const ShoppingListReducer = (state = INITIAL_STATE, action) => {
  let _shoppingList = Utils.clone(state);
  switch (action.type) {
    case INIT_SHOPPING_LIST:
      return action.shoppingList || [];

    case ADD_ITEM:
      const newItem = parseItem(action.name, action.quantity, action.ingredient_id);
      updateList(_shoppingList, newItem);
      save(_shoppingList);
      return _shoppingList;

    case ADD_ITEMS:
      action.items.forEach(item => {
        const newItem = parseItem(item.name, item.quantity, item.ingredient_id);
        updateList(_shoppingList, newItem);
      });
      save(_shoppingList);
      return _shoppingList;

    case REMOVE_ITEM:
      _shoppingList.splice(action.index, 1);
      save(_shoppingList);
      return _shoppingList;

    case TOGGLE_ITEM:
      _shoppingList[action.index].checked = !_shoppingList[action.index].checked;
      save(_shoppingList);
      return _shoppingList;

    default:
      return state;
  }
};

export default ShoppingListReducer;
