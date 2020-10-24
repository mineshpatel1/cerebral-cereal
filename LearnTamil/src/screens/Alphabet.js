import React from 'react';
import { ScrollView, View } from "react-native";

import {
    Button, Component, Container, Grid, Modal, Pressable, Text, TextInput, 
    Layout, StyleConstants,
} from 'cerebral-cereal-common';
import PhraseController from '../components/PhraseController';
const alphabetData = require('../../assets/alphabet.json');
const size = 72

export default class Alphabet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      currentLetter: null,
      helpModal: false,
    }
  }

  clearSearch = () => {
    this.setState({ search: null, currentLetter: null });
  }

  renderCell = (cell, cellStyle) => {
    const { Colours } = this.getTheme();
    const key = cell.vowel + '-' + cell.consonant;
    const { backgroundColor, ...childStyle} = cellStyle[1];
    const vowel = this._getIndex('vowels', cell.vowel);
    const consonant = this._getIndex('consonants', cell.consonant);
    return (
      <Pressable
        key={key}
        backgroundColour={Colours.background}
        rippleColour={Colours.primary}
        onPress={() =>  this.play(vowel, consonant)}
        containerStyle={cellStyle}
        style={[Layout.center, childStyle]}
      >
        <Text colour={Colours.foreground}>{cell.letter}</Text>
      </Pressable>
    );
  }

  _getIndex = (letterType, letter) => {
    let index = null;
    alphabetData[letterType].forEach((letterObj, i) => {
      if (letter == letterObj.pseudo) index = i;
    });
    return index + 1;
  }

  play = (vowel, consonant) => {
    this.phraseController.playLetter(vowel, consonant);
  }

  renderHeader = letterType => {
      return (header, cellStyle) => {
        const { Colours } = this.getTheme();
        const { backgroundColor, ...childStyle} = cellStyle[1];

        const vowel = letterType == 'vowels' ? this._getIndex(letterType, header.pseudo) : null;
        const consonant = letterType == 'consonants' ? this._getIndex(letterType, header.pseudo) : null;

        return (
          <Pressable
            key={header.pseudo}
            backgroundColour={Colours.primary}
            rippleColour={Colours.primaryLight}
            onPress={() =>  this.play(vowel, consonant)}
            containerStyle={cellStyle}
            style={[Layout.center, childStyle, {borderColor: Colours.primaryLight}]}
          >
            <Text colour={Colours.primaryContrast}>{header.pseudo + " " + header.letter}</Text>
          </Pressable>
        );
    }
  }

  filterAlphabet = () => {
    let alphabet = [];
    let consonants = [];
    let vowels = [];
    if (this.state.search) {
      // Filter using any terms in the search string, separated by a space.
      const search = this.state.search.toLowerCase().split(' ');

      alphabetData.vowels.forEach(v => {
        if (search.some(x => v.pseudo.toLowerCase() === x)) vowels.push(v);
      });

      alphabetData.consonants.forEach(v => {
        if (search.some(x => v.pseudo.toLowerCase() === x)) consonants.push(v);
      });

      alphabetData.alphabet.forEach((rawRow, i) => {
        const consonant = alphabetData.consonants[i];
        const hasConsonant = search.some(x => consonant.pseudo.toLowerCase() === x);
        let row = [];

        rawRow.forEach((datum, j) => {
          const vowel = alphabetData.vowels[j];
          const hasVowel = search.some(x => vowel.pseudo.toLowerCase() === x);

          // If only one letter is found, then show the whole row/column, otherwise
          // filter for in both directions
          if (vowels.length > 0 && consonants.length > 0) {
            if (hasConsonant && hasVowel) row.push(datum);
          } else if (hasConsonant || hasVowel) {
            row.push(datum);
          }
        });
        if (row.length > 0) alphabet.push(row);
        if (hasConsonant) consonants.push(consonant);
      });

      if (consonants.length == 0) consonants = alphabetData.consonants;
      if (vowels.length == 0) vowels = alphabetData.vowels;
    } else {
      alphabet = alphabetData.alphabet;
      consonants = alphabetData.consonants;
      vowels = alphabetData.vowels;
    }
    return {alphabet, consonants, vowels};
  }

  toggleHelp = () => this.setState({helpModal: !this.state.helpModal});

  render() {
    const { Colours, Styles } = this.getTheme();
    const { state } = this;
    const controller = {backgroundColor: Colours.primary};
    const data = this.filterAlphabet();
    const P = (props) => <Text style={Styles.paragraph}>{props.children}</Text>;

    const help = (
      <ScrollView>
        <View style={Layout.pd2}>
          <P>
            You can search for vowels and consonants in the grid by typing
            in the search bar. Separate terms using a space to search for
            a consonant and vowel at the same time. Try searching 'ng i'.
          </P>
          <View style={Layout.mt2}>
            <P>
              The search is not case sensitive and you can view multiple
              rows and columns and once. Try searching 'ch i aa k'.
            </P>
          </View>
          <View style={Layout.mt2}>
            <P>
              Click any letter (including vowels and consonants) to hear the
              pronunciation and see an example.
            </P>
          </View>
          <Button style={Layout.mt2} label="Close" onPress={this.toggleHelp} />
        </View>
      </ScrollView>
    )

    return (
      <Container>
        <PhraseController ref={x => this.phraseController = x} />
        <Modal
          propagateSwipe={true}
          visible={state.helpModal}
          onRequestClose={this.toggleHelp}
          style={{height: 500}}
        >
          {help}
        </Modal>
        <View style={[
          Layout.row, Layout.aCenter,
          Layout.pd1, Layout.pdx2, Layout.pdb2,
          controller,
          {
            borderBottomWidth: 2,
            borderColor: Colours.primaryContrast,
          },
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
            square icon='question'
            accessibilityLabel="Help"
            onPress={this.toggleHelp}
            disabledColour={Colours.offGrey}
            colour={Colours.primaryContrast}
            rippleColour={Colours.primary}
            fontColour={Colours.primary}
          />
        </View>
        {
          data.alphabet.length > 0 &&
          <Grid
            data={data.alphabet}
            rowHeaders={data.consonants}
            colHeaders={data.vowels}
            cellHeight={size}
            cellWidth={size}
            renderCell={this.renderCell}
            renderRowHeader={this.renderHeader('consonants')}
            renderColumnHeader={this.renderHeader('vowels')}
            rowStep={8}
            // Required to avoid chopping off the last part of the grid
            style={{marginBottom: 130}}
          />
        }
      </Container>
    )
  }
}

