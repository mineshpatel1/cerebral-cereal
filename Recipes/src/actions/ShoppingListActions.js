import {
  ADD_ITEMS, INIT_SHOPPING_LIST, REMOVE_ITEM, TOGGLE_ITEM, UPDATE_ITEM,
} from './types';


export const initShoppingList = shoppingList => ({
  type: INIT_SHOPPING_LIST,
  shoppingList,
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

export const updateItem = (index, item) => ({
  type: UPDATE_ITEM,
  index,
  item,
});

