import { GoogleSignin } from '@react-native-community/google-signin';
import Api from '../api';
import { ALTER_USER, CHECK_USER, SIGN_IN, SIGN_OUT } from './types';

export const alterUser = (userInfo = null) => ({
  type: ALTER_USER,
  userInfo,
});

export const checkUser = () => {
  return _checkUser = async (dispatch) => {
    const userInfo = await GoogleSignin.getCurrentUser();
    const session = await Api.checkUser();
    if (session.email != userInfo.user.email) throw Error("Current session invalid.");
    dispatch({ type: CHECK_USER, userInfo });
  }
}

export const signIn = () => {
  return _signIn = async (dispatch) => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    await Api.signIn(userInfo.idToken);
    dispatch({ type: SIGN_IN, userInfo });
  }
}

export const signOut = () => {
  return _signOut = async (dispatch) => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await Api.signOut();
    dispatch({ type: SIGN_OUT });
  }
}