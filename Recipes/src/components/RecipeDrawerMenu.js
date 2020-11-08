import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signIn, signOut } from '../actions/UserActions';

import { Component, DrawerMenu, Spinner, Toast } from 'cerebral-cereal-common';

class RecipeDrawerMenu extends Component {
  static defaultProps = {
    title: null,
    navigation: null,
    isOpen: false,
    loading: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  toggleLoading = () => this.setState({ loading: !this.state.loading });
  showError = err => this.toast.show(err.toString(), 'error');

  signIn = async () => {
    this.toggleLoading();
    this.props.signIn()
      .catch(this.showError)
      .finally(this.toggleLoading);
  }

  signOut = async () => {
    this.toggleLoading();
    this.props.signOut()
      .catch(this.showError)
      .finally(this.toggleLoading);
  }

  checkUser = () => {
    console.log(this.props.user);
  }

  render() {
    const { props, state } = this;
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
        <Toast ref={x => this.toast = x} />
        <Spinner loading={state.loading || props.loading} />
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
