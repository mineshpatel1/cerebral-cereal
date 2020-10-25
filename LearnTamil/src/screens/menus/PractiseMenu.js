import React from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button, Component, Pressable, ScreenContainer, Text, TextInput,
  Layout, StyleConstants
} from 'cerebral-cereal-common';

import { categories, phrases } from '../../data';
import TranslationToggle from '../../components/TranslationToggle';

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

  toggleTranslation = () => {
    this.setState({tamilToEnglish: !this.state.tamilToEnglish});
  }

  checkSearch = text => {
    return text.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1;
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { state } = this;
    const search = state.search;
    const phraseLinks = {};
    let filteredCategories = [];
    
    if (search && search.length >= 3) {
      categories.forEach(category => {
        if (this.checkSearch(category.name)) {
          filteredCategories.push(category);
        }

        phrases[category.id].forEach(phrase => {
          let i = 0;
          const phraseText = state.tamilToEnglish ? phrase.translation : phrase.original;
          
          let foundMatch = false;
          if (state.tamilToEnglish) {
            foundMatch = (
              // Searches script and translation if in Tamil to English mode
              this.checkSearch(phrase.translation) ||
              this.checkSearch(phrase.script)
            );
          } else {
            foundMatch = this.checkSearch(phrase.original);
          }

          if (foundMatch) {
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
                  style={[Layout.f1, Layout.p1, {borderRadius: 5}]}
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

    return (
      <ScreenContainer>
        <View style={Styles.switchList}>
          <TranslationToggle
            value={state.tamilToEnglish}
            onChange={this.toggleTranslation}
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
        {
          practiseButtons.length > 0 && 
          <ScrollView>{practiseButtons}</ScrollView>
        }
        {
            practiseButtons.length == 0 &&
            <View style={[Layout.f1, Layout.center]}>
              <Text>No results found</Text>
            </View>
          }
      </ScreenContainer>
    )
  }
}
