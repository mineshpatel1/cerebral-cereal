import { GoogleSignin } from '@react-native-community/google-signin';
import { ALTER_USER, CHECK_USER, SIGN_IN, SIGN_OUT } from './types';

export const alterUser = (userInfo = null) => ({
  type: ALTER_USER,
  userInfo,
});

export const checkUser = () => {
  return _checkUser = async (dispatch) => {
    const userInfo = await GoogleSignin.getCurrentUser();
    dispatch({ type: CHECK_USER, userInfo });
  }
}

export const signIn = () => {
  return _signIn = async (dispatch) => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    dispatch({ type: SIGN_IN, userInfo });
  }
}

export const signOut = () => {
  return _signOut = async (dispatch) => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    dispatch({ type: SIGN_OUT });
  }
}