import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimensions, View } from 'react-native';

import {
  Button, Component, Container, Header, HorizontalMenu, Text,
  Layout,
} from 'cerebral-cereal-common';

import Api from '../api';
import RecipeDrawerMenu from '../components/RecipeDrawerMenu';
import RecipesMenu from './menus/RecipesMenu';
import IngredientsMenu from './menus/IngredientsMenu';
import ShoppingListMenu from './menus/ShoppingListMenu';
import { setRecipes } from '../actions/RecipeActions';
import { setIngredients } from '../actions/IngredientActions';
import { setShoppingList } from '../actions/ShoppingListActions';
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

  toggleLoading = callback => this.setState({ loading: !this.state.loading }, callback);
  showToast = (message, mode) => this.container.showToast(message, mode);

  fetchData = () => {
    this.toggleLoading();
    Api.getRecipes()
      .then(results => {
        this.props.setRecipes(results.recipes);
        this.props.setIngredients(results.ingredients);
        this.props.setShoppingList(results.shoppingList);
      })
      .catch(err => {
        console.error(err);
        this.showToast(err.toString(), 'error');
      })
      .finally(this.toggleLoading);
  }

  signIn = () => {
    this.toggleLoading();
    this.props.signIn()
      .catch(err => this.showToast(err.toString(), 'error'))
      .finally(this.toggleLoading);
  }

  componentDidMount = () => {
    this.fetchData();
  }

  render() {
    const { Colours } = this.getTheme();
    const { state, props } = this;
    const screens = [
      {title: 'Recipes', icon: 'utensils', element: (
        <RecipesMenu navigation={this.props.navigation} showToast={this.showToast} />
      )},
      {title: 'Shopping List', icon: 'shopping-cart', element: (
        <ShoppingListMenu navigation={this.props.navigation} showToast={this.showToast} />
      )},
      {title: 'Ingredients', icon: 'carrot', element: (
        <IngredientsMenu navigation={this.props.navigation} showToast={this.showToast} />
      )},
    ];

    const isConnected = this.context.isConnected;

    return (
      /*
        Using dark background colour and light foreground so
        that the bottom of the iOS app matches the menu bar
      */
      <Container
        colour={Colours.background}
        loading={state.loading}
        ref={x => this.container = x}
      >
        <RecipeDrawerMenu
          title={"Info & Settings"}
          navigation={props.navigation}
          isOpen={state.showDrawer}
          onRequestClose={() => this.setState({showDrawer: false})}
          toggleLoading={this.toggleLoading}
          showToast={this.showToast}
        >
          <Header
            title={screens[this.state.index].title}
            link={{icon: 'bars', onPress: () => this.setState({showDrawer: true})}}
          />
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
        </RecipeDrawerMenu>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ signIn, setRecipes, setIngredients, setShoppingList }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

