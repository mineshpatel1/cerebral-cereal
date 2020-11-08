import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimensions, View } from 'react-native';

import {
  Button, Component, Container, Header, HorizontalMenu, Text,
  Layout,
} from 'cerebral-cereal-common';
import RecipeDrawerMenu from '../components/RecipeDrawerMenu';
import RecipesMenu from './menus/RecipesMenu';
import IngredientsMenu from './menus/IngredientsMenu';
import ShoppingListMenu from './menus/ShoppingListMenu';
import { signIn } from '../actions/UserActions';

const maxWidth = Dimensions.get('window').width;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      showDrawer: false,
      loading: false,
    }
  }

  toggleLoading = () => this.setState({ loading: !this.state.loading });

  signIn = () => {
    this.toggleLoading();
    this.props.signIn()
      .catch(err => {console.error(err)})
      .finally(this.toggleLoading);
  }

  render() {
    const { Colours } = this.getTheme();
    const { state, props } = this;
    const screens = [
      {title: 'Recipes', icon: 'utensils', element: (
        <RecipesMenu navigation={this.props.navigation} />
      )},
      {title: 'Shopping List', icon: 'shopping-cart', element: (
        <ShoppingListMenu navigation={this.props.navigation} />
      )},
      {title: 'Ingredients', icon: 'carrot', element: (
        <IngredientsMenu navigation={this.props.navigation} />
      )},
    ];

    const isConnected = this.context.isConnected;

    return (
      <RecipeDrawerMenu
        title={"Info & Settings"}
        navigation={props.navigation}
        isOpen={state.showDrawer}
        onRequestClose={() => this.setState({showDrawer: false})}
        loading={state.loading}
      >
        <Header
          title={screens[this.state.index].title}
          link={{icon: 'bars', onPress: () => this.setState({showDrawer: true})}}
        />
        {/*
          Using dark background colour and light foreground so
          that the bottom of the iOS app matches the menu bar
        */}
        <Container colour={Colours.background}>
          {
            this.props.user &&
            <HorizontalMenu
              screens={screens} icons={screens.map(s => s.icon)}
              width={maxWidth}
              style={{backgroundColor: Colours.background}}
              onSelect={i => this.setState({index: i})}
              keyboardShouldPersistTaps="handled"
            />
          }
          {
            !this.props.user &&
            <View style={[Layout.center, Layout.f1, Layout.p2]}>
              {
                !isConnected &&
                <Text style={Layout.mb2}>No Internet connection detected</Text>
              }
              <Button label="Sign In" icon="sign-in-alt" onPress={this.signIn} disabled={!isConnected} />
            </View>
          }
        </Container>
      </RecipeDrawerMenu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ signIn }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

