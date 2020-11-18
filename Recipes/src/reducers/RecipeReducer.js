import AsyncStorage from '@react-native-community/async-storage';
import { SET_RECIPES, INIT_RECIPES } from '../actions/types';

const INITIAL_STATE = [];

const RecipeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_RECIPES:
      return action.recipes || [];

    case SET_RECIPES:
      AsyncStorage.setItem('recipes', JSON.stringify(action.recipes));
      return action.recipes;
      
    default:
      return state;
  }
};

export default RecipeReducer;
