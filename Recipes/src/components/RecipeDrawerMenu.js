import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signIn, signOut } from '../actions/UserActions';

import { Component, DrawerMenu } from 'cerebral-cereal-common';

class RecipeDrawerMenu extends Component {
  static defaultProps = {
    title: null,
    navigation: null,
    isOpen: false,
    loading: false,
    toggleLoading: null,
  }

  showError = err => this.props.showToast(err.toString(), 'error');

  signIn = async () => {
    this.props.toggleLoading();
    this.props.signIn()
      .catch(this.showError)
      .finally(this.props.toggleLoading);
  }

  signOut = async () => {
    this.props.toggleLoading();
    this.props.signOut()
      .catch(this.showError)
      .finally(this.props.toggleLoading);
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
      signIn,
    ];

    return (
      <>
        <DrawerMenu
          title={props.title}
          menu={menuItems}
          isOpen={props.isOpen}
          navigation={props.navigation}
          onRequestClose={props.onRequestClose}
        >
          {props.children}
        </DrawerMenu>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ signIn, signOut }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDrawerMenu);
