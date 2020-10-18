import { INIT_SETTINGS, SAVE_SETTINGS } from './types';

export const initSettings = (settings, defaultSettings) => ({
  type: INIT_SETTINGS,
  settings,
  defaultSettings,
});

export const saveSettings = (settings, defaultSettings) => {
  return {
    type: SAVE_SETTINGS,
    settings,
    defaultSettings,
  }
};
