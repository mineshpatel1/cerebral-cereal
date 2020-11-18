import { INIT_RECIPES, SET_RECIPES } from './types';

export const initRecipes = recipes => ({
  type: INIT_RECIPES,
  recipes,
});

export const setRecipes = recipes => ({
  type: SET_RECIPES,
  recipes,
});
