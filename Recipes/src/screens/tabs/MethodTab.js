import React from 'react';
import { ScrollView, View } from 'react-native';

import {
  Component, ScreenContainer, Text,
  Layout,
} from 'cerebral-cereal-common';

import { timeRegex } from '../../config';

export default class MethodTab extends Component {
  static defaultProps = {
    method: [],
    onLink: null,
  }

  render() {
    const { props } = this;
    const methodElements = []
    props.method.forEach((step, i) => {
      const padding = i == 0 ? Layout.pdy2 : Layout.pdb2;
      const stepElements = [<Text key={'-1'}>{(i + 1) + '. '}</Text>];
      step.split(timeRegex).forEach((part, j) => {
        stepElements.push(
          <Text
            key={j} link={j % 2 == 1}
            onPress={() => {if (props.onLink) props.onLink(i)}}
          >{part}</Text>
        );
      })

      methodElements.push(
        <View key={i} style={[Layout.row, Layout.pdx2, padding]}>
          <Text>
            {stepElements}
          </Text>
        </View>
      );
    });
    
    return (
      <ScreenContainer>
        <ScrollView>
          {methodElements}
        </ScrollView>
      </ScreenContainer>
    )
  }
}

