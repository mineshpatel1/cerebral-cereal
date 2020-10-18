import AsyncStorage from '@react-native-community/async-storage';

import { INIT_SETTINGS, SAVE_SETTINGS } from '../actions/types';
import { Utils } from '../utils/Utils';

const INITIAL_STATE = {};

const settingsReducer = (state = INITIAL_STATE, action) => {
  let _settings;
  const defaultSettings = action.defaultSettings;

  switch (action.type) {
    case INIT_SETTINGS:
      _settings = Utils.mapObject(defaultSettings, v => v.default);
      if (action.settings) {
        _settings = Utils.update(_settings, action.settings);
      }

      // Any static settings values should be overridden.
      for (const field in _settings) {
        if (
          defaultSettings[field] &&
          !defaultSettings[field].choices &&
          defaultSettings[field].type == 'string'
        ) {
          _settings[field] = defaultSettings[field].default;
        }
      }
      return _settings;

    case SAVE_SETTINGS:
      _settings = Utils.clone(state);
      _settings = Utils.mapObject(
        _settings, (_v, k) => {
          if (defaultSettings[k]) {
            return Utils.parseValue(
              action.settings[k],
              defaultSettings[k].type,
            )
          }
        },
      );
      AsyncStorage.setItem('settings', JSON.stringify(_settings));
      return _settings;

    default:
      return state;
  }
};

export default settingsReducer;
