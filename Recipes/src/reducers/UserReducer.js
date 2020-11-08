import { ALTER_USER, CHECK_USER, SIGN_IN, SIGN_OUT} from '../actions/types';

const INITIAL_STATE = null;

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALTER_USER:
      return action.userInfo;

    case CHECK_USER:
      return action.userInfo;

    case SIGN_IN:
      return action.userInfo;

    case SIGN_OUT:
      return null;
      
    default:
      return state;
  }
};

export default UserReducer;
