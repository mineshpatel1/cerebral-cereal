import { ADD_ITEM, ADD_ITEMS, INIT_SHOPPING_LIST, REMOVE_ITEM, TOGGLE_ITEM } from './types';

export const initShoppingList = shoppingList => ({
  type: INIT_SHOPPING_LIST,
  shoppingList,
});

export const addItem = (name, quantity=1, ingredient_id=null) => ({
  type: ADD_ITEM,
  name,
  quantity,
  ingredient_id,
});

export const addItems = items => ({
  type: ADD_ITEMS,
  items,
});

export const removeItem = index => ({
  type: REMOVE_ITEM,
  index,
});

export const toggleItem = index => ({
  type: TOGGLE_ITEM,
  index,
});

