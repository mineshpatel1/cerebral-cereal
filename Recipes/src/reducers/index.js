import { combineReducers } from 'redux';
import { SettingsReducer } from 'cerebral-cereal-common/reducers';
import IngredientReducer from './IngredientReducer';
import RecipeReducer from './RecipeReducer';
import ShoppingListReducer from './ShoppingListReducer';
import UserReducer from './UserReducer';


export default combineReducers({
  settings: SettingsReducer,
  recipes: RecipeReducer,
  ingredients: IngredientReducer,
  shoppingList: ShoppingListReducer,
  user: UserReducer,
})
