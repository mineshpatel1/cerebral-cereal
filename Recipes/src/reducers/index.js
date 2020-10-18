import { combineReducers } from 'redux';
import { SettingsReducer } from 'cerebral-cereal-common/reducers';
import ShoppingListReducer from './ShoppingListReducer';

export default combineReducers({
  settings: SettingsReducer,
  shoppingList: ShoppingListReducer,
})
