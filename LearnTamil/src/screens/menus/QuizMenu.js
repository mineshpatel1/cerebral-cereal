import React from 'react';
import { ScrollView, View } from 'react-native';

import {
    Button, Component, ChecklistItem, ScreenContainer, SwitchInput, Text,
    Layout,
} from 'cerebral-cereal-common';
import { categories } from '../../data';
import TranslationToggle from '../../components/TranslationToggle';

export default class QuizMenu extends Component {
  static defaultProps = {
    navigation: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      checkStates: categories.map(() => false),
      tamilToEnglish: true,
      quizMode: true,
    }
  }

  toggleCheck = (i) => {
    this.setState({
      checkStates: this.state.checkStates.map((c, j) => {
        return i == j ? !c : c;
      })
    });
  }

  toggleTranslation = () => {
    this.setState({tamilToEnglish: !this.state.tamilToEnglish});
  }

  toggleMode = () => {
    this.setState({quizMode: !this.state.quizMode});
  }

  selectAll = (all) => {
    this.setState({
      checkStates: categories.map(c => all),
    });
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { props, state } = this;
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
    return (
      <ScreenContainer style={Layout.pb2}>
        <View style={Styles.switchList}>
          <SwitchInput
            labelTrue={'Multiple Choice'}
            labelFalse={'Flashcards'}
            accessibilityLabel={'Will switch game mode.'}
            onToggle={this.toggleMode}
            value={state.quizMode}
          />
          <TranslationToggle
            value={state.tamilToEnglish}
            onChange={this.toggleTranslation}
          />
        </View>
        <Text style={[Layout.mt2, Layout.mb1]}>Choose categories:</Text>
        <ChecklistItem
          text={'Select ' + (allSelected ? 'None' : 'All')}
          onPress={() => {this.selectAll(!allSelected)}}
          checked={allSelected}
          style={[
            Layout.mt1, Layout.pb1,
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
            props.navigation.navigate(
              state.quizMode ? 'Quiz' : 'Flashcards',
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

