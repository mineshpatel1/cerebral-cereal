import { combineReducers } from 'redux';
import { SettingsReducer } from 'cerebral-cereal-common/reducers';
import ShoppingListReducer from './ShoppingListReducer';
import UserReducer from './UserReducer';

export default combineReducers({
  settings: SettingsReducer,
  shoppingList: ShoppingListReducer,
  user: UserReducer,
})
