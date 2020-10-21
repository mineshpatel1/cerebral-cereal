import React from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';

import { 
  Button, Component, Container, DrawerMenu, Header, SelectableItem, TextInput,
  Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { phrases } from '../data';
import Phrase from '../components/Phrase';
import PhraseController from '../components/PhraseController';

class Practise extends Component {
  constructor(props) {
    super(props);
    this.categoryName = props.route.params.categoryName;
    this.tamilToEnglish = props.route.params.tamilToEnglish;
    this.state = {
      search: null,
      currentPhrase: props.route.params.phrase,
      shuffle: false,
      phrases: [],
      showDrawer: false,
    }
  }

  itemSelect = phrase => {
    this.phraseController.playPhrase(phrase);
    this.setState({currentPhrase: phrase});
  }

  clearSearch = () => {
    this.setState({
      search: null, currentPhrase: null,
    });
  }

  sortPhrases = (shuffle, callback) => {
    const { props } = this;

    let _phrases = phrases[props.route.params.categoryId];
    if (shuffle) {
      _phrases = Utils.shuffle(_phrases.slice());
    } else if (this.tamilToEnglish) {
      _phrases = Utils.sortByKey(_phrases, 'translation');
    }
    this.setState(
      {phrases: _phrases, shuffle: shuffle},
      callback,
    );
  }

  play = () => {
    this.phraseController.playPhrase(this.state.currentPhrase);
  }

  componentDidMount() {
    this.sortPhrases(
      this.props.settings.randomisePractise,
      () => {
        if (this.state.currentPhrase) {
          this.play();

          let phraseIdx;
          this.state.phrases.forEach((phrase, i) => {
            if (phrase.id == this.state.currentPhrase.id) {
              phraseIdx = i;
            }
          });
          
          // 100ms is long enough for most elements in the flat list
          // to load when we need to scroll to a value.
          setTimeout(() => this.scroller.scrollToIndex({index: phraseIdx}), 200);
        }
      }
    );
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;
    const search = state.search;

    const phraseData = [];
    state.phrases.forEach((_phrase) => {
      if (search) {
        if (_phrase.original.toLowerCase().indexOf(search.toLowerCase()) == -1)
          return;
      }
      phraseData.push(_phrase)
    });

    const phraseFn = ({ item }) => {
      const currentId = state.currentPhrase ? state.currentPhrase.id : -1;
      const text = !this.tamilToEnglish ? item.original : item.translation + '\n' + (item.script ? item.script : '');


      return (
        <SelectableItem
          text={text}
          selected={item.id == currentId}
          onSelect={() => { this.itemSelect(item); }}
        />
      )
    }

    const controller = {backgroundColor: Colours.primary};

    const menuItems = [
      {label: 'Tamil Alphabet', icon: 'book', route: 'Alphabet'},
      {label: 'Help', icon: 'question', route: 'Help'},
      {label: 'Settings', icon: 'cog', route: 'Settings'},
      {label: 'Acknowledgements', icon: 'users', route: 'Acknowledgements'},
    ];

    return (
      <DrawerMenu
        title={"Info & Settings"}
        menu={menuItems}
        isOpen={state.showDrawer}
        navigation={props.navigation}
        onRequestClose={() => this.setState({showDrawer: false})}
      >
        <Header
          title={this.categoryName}
          showBack={true}
          nav={props.navigation}
          link={{
            icon: 'bars', label: 'Settings Menu',
            onPress: () => this.setState({showDrawer: true})
          }}
        />
        <Container>
          <PhraseController ref={x => this.phraseController = x} />
          <View style={[
            Layout.row, Layout.pd1, Layout.pdx2, Layout.aCenter, controller,
          ]}>
            <TextInput
              icon="search"
              placeholder="Search"
              value={state.search}
              colour={Colours.primaryContrast}
              placeholderColour={Colours.primaryLight}
              onChange={val => this.setState({search: val})}
              onFocus={this.clearSearch}
              style={{marginRight: (StyleConstants.size2 * 2)}}
            />
            <Button
              square icon={state.shuffle ? 'sort-alpha-down': 'random'}
              onPress={() => this.sortPhrases(!state.shuffle)}
              disabledColour={Colours.offGrey}
              colour={Colours.primaryContrast}
              rippleColour={Colours.primary}
              fontColour={Colours.primary}
              accessibilityLabel={state.shuffle ? "Sort Alphabetically" : "Shuffle"}
            />
          </View>
          <View style={[
            Layout.row, Layout.aCenter, Layout.pd1, Layout.pdx2, controller,
            {
              borderBottomWidth: 2,
              borderColor: Colours.primaryContrast,
            },
          ]}>
            <Phrase
              phrase={state.currentPhrase}
              onPress={this.play}
              isTranslation={!this.tamilToEnglish}
            />
          </View>
          <FlatList
            ref={(ref) => this.scroller = ref}
            data={phraseData}
            renderItem={phraseFn}
            keyExtractor={item => item.id.toString()}
            maxToRenderPerBatch={50}
            scrollEventThrottle={100}
            getItemLayout={(_data, index) => {
              return {length: _data.length, offset: 60 * index, index};
            }}
          />
        </Container>
      </DrawerMenu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

export default connect(mapStateToProps)(Practise);
