import { ALTER_USER } from '../actions/types';

const INITIAL_STATE = null;

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALTER_USER:
      return action.userInfo;

    default:
      return state;
  }
};

export default UserReducer;
