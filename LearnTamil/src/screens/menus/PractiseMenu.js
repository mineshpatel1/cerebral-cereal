import React from 'react';
import { Pressable as ReactPressable, View } from 'react-native';

import {
  Button, Component, Pressable, ScreenContainer, Switch, Text, TextInput,
  Layout, StyleConstants
} from 'cerebral-cereal-common';

import { categories, phrases } from '../../data';
import { ScrollView } from 'react-native-gesture-handler';

export default class PractiseMenu extends Component {
  static defaultProps = {
    navigation: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      tamilToEnglish: false,
    }
  }

  navigate = (category, phrase) => {
    this.props.navigation.navigate(
      'Practise',
      {
        categoryName: category.name,
        categoryId: category.id,
        phrase: phrase,
        headerOverride: category.name,
        tamilToEnglish: this.state.tamilToEnglish,
        link: {icon: 'question', route: 'Help'},
      }
    )
  }

  toggleTranslation = tamilToEnglish => {
    this.setState({tamilToEnglish});
  }

  render() {
    const { Colours } = this.getTheme();
    const { state } = this;
    const search = state.search;
    const phraseLinks = {};
    let filteredCategories = [];
    
    if (search && search.length >= 3) {
      categories.forEach(category => {
        if (category.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
          filteredCategories.push(category);
        }

        phrases[category.id].forEach(phrase => {
          let i = 0;
          const phraseText = state.tamilToEnglish ? phrase.translation : phrase.original;
          
          if (phraseText.toLowerCase().indexOf(search.toLowerCase()) > -1) {
            if (!phraseLinks[category.id]) phraseLinks[category.id] = [];
            const margin = i == 0 ? Layout.mt1 : null;

            phraseLinks[category.id].push(
              <View
                key={phrase.id}
                style={[
                  margin,
                  Layout.row,
                  Layout.mx1,
                  {backgroundColor: Colours.background, borderRadius: 5},
                ]}>
                <Pressable
                  style={[Layout.f1, Layout.pd1, {borderRadius: 5}]}
                  containerStyle={[Layout.f1]}
                  backgroundColour={Colours.background}
                  onPress={() => this.navigate(category, phrase)}
                >
                  <Text
                    key={phraseText}
                    align="left"
                  >
                    {phraseText}
                  </Text>
              </Pressable>
              </View>
            );
            if (filteredCategories.map(category => category.id).indexOf(category.id) == -1) {
              filteredCategories.push(category);
            }
            i++;
          }
        });
      });
    } else {
      filteredCategories = categories;
    }

    const practiseButtons = [];
    filteredCategories.forEach((category, i) => {
      let margin = null;
      if (i == filteredCategories.length - 1) margin = Layout.mb1;
      if (i == 0) margin = Layout.mt1;

      practiseButtons.push(
        <View key={i} style={margin}>
          <Button
            style={Layout.mt1}
            label={category.name}
            icon={category.icon}
            justify='flex-start'
            onPress={() => this.navigate(category)}
          />
          {phraseLinks[category.id]}
        </View>
      )
    });

    const translationText = (
      state.tamilToEnglish ?
      'Tamil to English' :
      'English to Tamil'
    );

    return (
      <ScreenContainer>
        <View style={[
          Layout.row, Layout.aCenter,
          Layout.mt2, Layout.mb1, Layout.pdb1,
          {
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: Colours.disabled,
          }
        ]}>
          <ReactPressable onPress={() => this.toggleTranslation(!state.tamilToEnglish)}>
            <Text>{translationText}</Text>
          </ReactPressable>
          <Switch
            onValueChange={this.toggleTranslation}
            value={state.tamilToEnglish}
          />
        </View>
        <View style={{height: StyleConstants.iconWidth}}>
          <TextInput
            icon="search"
            placeholder="Search"
            value={state.search}
            onFocus={() => this.setState({search: null})}
            onChange={val => this.setState({search: val})}
          />
        </View>
        <ScrollView>
          { practiseButtons }
        </ScrollView>
      </ScreenContainer>
    )
  }
}
