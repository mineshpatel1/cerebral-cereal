import { Utils } from 'cerebral-cereal-common';
import { ADD_ITEM, ADD_ITEMS, REMOVE_ITEM, TOGGLE_ITEM } from '../actions/types';

const INITIAL_STATE = [];

const parseItem = (name, quantity, ingredient_id) => {
  let newItem = {
    name: name,
    quantity: quantity,
    ingredient_id: ingredient_id,
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

const ShoppingListReducer = (state = INITIAL_STATE, action) => {
  let _shoppingList = Utils.clone(state);
  switch (action.type) {
    case ADD_ITEM:
      const newItem = parseItem(action.name, action.quantity, action.ingredient_id);
      updateList(_shoppingList, newItem);
      return _shoppingList;

    case ADD_ITEMS:
      action.items.forEach(item => {
        const newItem = parseItem(item.name, item.quantity, item.ingredient_id);
        updateList(_shoppingList, newItem);
      });
      return _shoppingList;

    case REMOVE_ITEM:
      _shoppingList.splice(action.index, 1);
      return _shoppingList;

    case TOGGLE_ITEM:
      _shoppingList[action.index].checked = !_shoppingList[action.index].checked;
      return _shoppingList;

    default:
      return state;
  }
};

export default ShoppingListReducer;
