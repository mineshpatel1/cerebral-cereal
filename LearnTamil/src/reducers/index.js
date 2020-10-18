import { combineReducers } from 'redux';
import ProgressReducer from './ProgressReducer';
import { SettingsReducer } from 'cerebral-cereal-common/reducers';

export default combineReducers({
  progress: ProgressReducer,
  settings: SettingsReducer,
})
