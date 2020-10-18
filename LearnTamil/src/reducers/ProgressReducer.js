import AsyncStorage from '@react-native-community/async-storage';

import { ANSWER_QUESTION, INIT_PROGRESS, CLEAR_PROGRESS } from '../actions/types';
import { Utils } from 'cerebral-cereal-common';

const INITIAL_STATE = {};

const progressReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_PROGRESS:
      _progress = action.progress || {};
      return _progress;

    case CLEAR_PROGRESS:
      AsyncStorage.setItem('progress', JSON.stringify({}));
      return {};

    case ANSWER_QUESTION:
      let _progress = Utils.clone(state);
      let categoryId = action.categoryId;

      if (!_progress.hasOwnProperty(categoryId)) {
        _progress[categoryId] = {
          'attempted': 0,
          'correct': 0,
        };
      }
      _progress[categoryId].attempted += 1;
      if (action.isCorrect) _progress[categoryId].correct += 1;
      AsyncStorage.setItem('progress', JSON.stringify(_progress));
      return _progress;

    default:
      return state;
  }
};

export default progressReducer;
