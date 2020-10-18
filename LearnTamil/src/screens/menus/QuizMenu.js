import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
    Button, Component, ChecklistItem, ScreenContainer, Switch, Text,
    Layout,
} from 'cerebral-cereal-common';
import { categories } from '../../data';

export default class QuizMenu extends Component {
  static defaultProps = {
    navigation: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      checkStates: categories.map(c => false),
      tamilToEnglish: true,
    }
  }

  toggleCheck = (i) => {
    this.setState({
      checkStates: this.state.checkStates.map((c, j) => {
        return i == j ? !c : c;
      })
    });
  }

  toggleTranslation = val => {
    this.setState({tamilToEnglish: val});
  }

  selectAll = (all) => {
    this.setState({
      checkStates: categories.map(c => all),
    });
  }

  render() {
    const { Colours } = this.getTheme();
    const { state } = this;
    let categoryList = [];
    categories.forEach((category, i) => {
      categoryList.push(
        <ChecklistItem
          key={i}
          style={[Layout.mt1]}
          onPress={() => {this.toggleCheck(i)}}
          checked={state.checkStates[i]}
          icon={category.icon}
          text={category.name}
        />
      );
    });

    const quizDisabled = state.checkStates.filter(c => c).length == 0;
    const allSelected = state.checkStates.filter(c => c).length == categories.length;
    const translationText = (
      state.tamilToEnglish ?
      'Tamil to English' :
      'English to Tamil'
    );

    return (
      <ScreenContainer style={Layout.pdb2}>
        <View style={[Layout.row, Layout.mt2, {justifyContent: 'space-between' }]}>
          <Pressable onPress={() => this.toggleTranslation(!state.tamilToEnglish)}>
            <Text>{translationText}</Text>
          </Pressable>
          <Switch
            onValueChange={this.toggleTranslation}
            value={state.tamilToEnglish}
          />
        </View>
        <Text style={[Layout.mt2, Layout.mb1]}>Choose categories:</Text>
        <ChecklistItem
          text={'Select ' + (allSelected ? 'None' : 'All')}
          onPress={() => {this.selectAll(!allSelected)}}
          checked={allSelected}
          style={[
            Layout.mt1, Layout.pdb1,
            {borderColor: Colours.disabled, borderBottomWidth: 1},
          ]}
        />
        <ScrollView style={[Layout.f1, Layout.col]}>
          { categoryList }
        </ScrollView>
        <Button
          style={Layout.mt1} label="Start Quiz"
          disabled={quizDisabled}
          onPress={() => {
            this.props.navigation.navigate(
              'Quiz',
              {
                tamilToEnglish: state.tamilToEnglish,
                categories: state.checkStates.map(
                  (c, i) => c ? categories[i].id : null
                ).filter(i => i != null)
              }
            )
          }}
        />
      </ScreenContainer>
    )
  }
}

