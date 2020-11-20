import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

import { Component, Text, Layout, Utils} from 'cerebral-cereal-common';
import { initSettings } from 'cerebral-cereal-common/actions';
import { defaultSettings } from '../config';
import { checkUser } from '../actions/UserActions';
import { initRecipes } from '../actions/RecipeActions';
import { initIngredients } from '../actions/IngredientActions';
import { initShoppingList } from '../actions/ShoppingListActions';
const googleCreds = require('../../private/google-services.json');

class Startup extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      init: false,
    };
  }

  loadSettings = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.multiGet(['settings', 'recipes', 'ingredients', 'shoppingList'])
        .then(result => {
          const settings = JSON.parse(result[0][1]);  // Settings Value
          const colourTheme = settings ? settings.colourTheme : null;
          const theme = Utils.appearanceMode(colourTheme);
          this.props.initSettings(settings, defaultSettings);
          this.context.changeTheme(theme, resolve);

          const recipes = JSON.parse(result[1][1]);  // Recipes Value
          this.props.initRecipes(recipes);

          const ingredients = JSON.parse(result[2][1]);  // Ingredients Value
          this.props.initIngredients(ingredients);

          const shoppingList = JSON.parse(result[3][1]);  // Shopping List Value
          this.props.initShoppingList(shoppingList);
        })
        .catch(reject);
    });
  }

  checkUser = () => {
    return new Promise((resolve) => {
      if (!this.context.isConnected) return resolve();
      GoogleSignin.configure({
        webClientId: googleCreds.web.client_id,
        iosClientId: googleCreds.ios.client_id,
      });

      this.props.checkUser()
        .then(resolve)
        .catch(() => resolve());       
    });
  }

  componentDidMount() {
    const waitSettings = this.loadSettings();
    const waitUser = this.checkUser();

    Promise.all([waitSettings, waitUser])
      .then(() => {
        this.setState({init: true}, () => SplashScreen.hide());
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    if (this.state.init) {
      return this.props.children;
    } else {
      return (
        <View style={[Layout.f1, Layout.center]}>
          <Text>Loading...</Text>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ initSettings, initRecipes, initIngredients, initShoppingList, checkUser }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
