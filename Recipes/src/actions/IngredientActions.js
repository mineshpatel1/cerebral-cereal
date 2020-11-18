import { INIT_INGREDIENTS, SET_INGREDIENTS } from './types';

export const initIngredients = ingredients => ({
  type: INIT_INGREDIENTS,
  ingredients,
});

export const setIngredients = ingredients => ({
  type: SET_INGREDIENTS,
  ingredients,
});