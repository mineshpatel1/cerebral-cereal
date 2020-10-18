import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Component, NavUtils } from 'cerebral-cereal-common';

import Home from './screens/Home';
import Ingredient from './screens/Ingredient';
import Recipe from './screens/Recipe';
import Settings from './screens/Settings';

const Stack = createStackNavigator();
const homePage = 'Home';

export default class NavStack extends Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName={homePage}
        headerMode='screen'
        screenOptions={{
          header: NavUtils.renderHeader(homePage),
          cardStyleInterpolator: NavUtils.slide,
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Ingredient" component={Ingredient} />
        <Stack.Screen name="Recipe" component={Recipe} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    )
  }
}

