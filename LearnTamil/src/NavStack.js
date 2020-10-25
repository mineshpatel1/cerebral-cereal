import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NavUtils } from 'cerebral-cereal-common';

import Acknowledgements from './screens/Acknowledgements';
import Alphabet from './screens/Alphabet';
import Flashcards from './screens/Flashcards';
import Help from './screens/Help';
import Home from './screens/Home';
import Practise from './screens/Practise';
import Quiz from './screens/Quiz';
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
        <Stack.Screen name="Practise" component={Practise} options={{headerShown: false}} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Flashcards" component={Flashcards} />
        <Stack.Screen name="Alphabet" component={Alphabet} options={{headerTitle: 'Alphabet'}} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Acknowledgements" component={Acknowledgements} />
      </Stack.Navigator>
    )
  }
}

