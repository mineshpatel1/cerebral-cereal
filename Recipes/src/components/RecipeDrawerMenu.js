import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleSignin } from '@react-native-community/google-signin';
import { alterUser } from '../actions/UserActions';

import { Component, DrawerMenu } from 'cerebral-cereal-common';

class RecipeDrawerMenu extends Component {
  static defaultProps = {
    title: null,
    navigation: null,
    isOpen: false,
  }

  signIn = async () => {
    console.log('Attempting Sign In');
    let userInfo = null;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
    } catch (err) {  // Failed Sign In for whatever reason
      console.log(err);
    }
    this.props.alterUser(userInfo);
  }

  checkSignIn = async () => {
    const isSignedIn = await GoogleSignin.getCurrentUser();
    console.log(isSignedIn, this.props.user);
  }

  checkUser = () => {
    console.log(this.props.user);
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (err) {
      console.log(err);
    }
    this.props.alterUser(null);  // Clear local state regardless
  }

  render() {
    const { props } = this;
    const isConnected = this.context.isConnected;

    const signIn = (
      props.user ?
      {label: 'Sign Out', icon: 'sign-out-alt', onPress: this.signOut, disabled: !isConnected} :
      {label: 'Sign In', icon: 'sign-out-alt', onPress: this.signIn, disabled: !isConnected}
    );

    const menuItems = [
      {label: 'Settings', icon: 'cog', route: 'Settings'},
      {label: 'Check user', icon: 'carrot', onPress: this.checkUser, disabled: !isConnected},
      signIn,
    ];

    return (
      <DrawerMenu
        title={props.title}
        menu={menuItems}
        isOpen={props.isOpen}
        navigation={props.navigation}
        onRequestClose={props.onRequestClose}
      >
        {props.children}
      </DrawerMenu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ alterUser }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDrawerMenu);
