import React from 'react';
import { Animated } from 'react-native';

import { Header } from '../components/Header';

export class NavUtils {
  constructor() {}

  static fade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  
  static slide = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0
    );
  
    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.3, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
    };
  };

  static renderHeader = homePage => {
    return ({scene, navigation}) => {
      const { options } = scene.descriptor;
      const title =
        options.headerTitle !== undefined
          ? options.headerTitle
          : scene.route.params.headerOverride !== undefined
          ? scene.route.params.headerOverride
          : scene.route.name;
    
      const link = scene.route.params ? scene.route.params.link: null;
      const nav = scene.route.name !== homePage ? navigation : null;
      const showBack = scene.route.name !== homePage;
      return (
        <Header title={title} nav={nav} link={link} showBack={showBack} />
      )
    }
  }
}
