import React from 'react';
import { connect } from 'react-redux';
import { AccessibilityInfo, View, Animated } from 'react-native';

import {
    Button, Component, Container, Pressable, Text,
    Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { phrases } from '../data';
import LocalUtils from '../utils';
import PhraseController from '../components/PhraseController';
import Phrase from '../components/Phrase';

class Flashcards extends Component {
  static defaultProps = {
    animationDuration: 150,
  }

  constructor(props) {
    let _allPhrases = [];
    props.route.params.categories.forEach(categoryId => {
      _allPhrases = _allPhrases.concat(phrases[categoryId]);
    })
    const {currentPhrase, allPhrases} = LocalUtils.shufflePhrases(_allPhrases);

    super(props);
    this.state = {
      tamilToEnglish: props.route.params.tamilToEnglish,
      allPhrases: allPhrases,
      currentPhrase: currentPhrase,
      numQuestions: Math.min(
        props.settings.numQuestions,
        _allPhrases.length
      ),
      opacity: new Animated.Value(0),
      textOpacity: new Animated.Value(1),
      questionNum: 1,
      showPhrase: false,
    }
  }

  fadeOut = (callback) => {
    Utils.animate(
      this.state.opacity, 0,
      {
        duration: this.props.animationDuration,
        callback,
      },
    );
  }

  fadeIn = (callback) => {
    if (this.state.tamilToEnglish) {
      this.playQuestion();
    }

    Utils.animate(
      this.state.opacity, 1,
      {
        duration: this.props.animationDuration,
        callback,
      },
    );
  }

  playQuestion = () => {
    this.phraseController.playPhrase(this.state.currentPhrase);
  }

  nextQuestion = () => {
    const { state } = this;
    if (state.numQuestions == state.questionNum) {
      this.props.navigation.goBack();
    } else {
      this.fadeOut(() => {    
        const {
          currentPhrase, allPhrases,
        } = LocalUtils.shufflePhrases(state.allPhrases);
    
        this.setState({
          allPhrases,
          currentPhrase,
          questionNum: state.questionNum + 1,
          showPhrase: false,
        }, this.fadeIn);
      });
    }
  }

  fadeText = (val, callback=null) => {
    Utils.animate(
      this.state.textOpacity, val,
      {
        duration: this.props.animationDuration,
        callback,
      }
    );
  }

  // Fade text in and out
  toggleText = () => {
    this.fadeText(0, () => {
      this.setState({showPhrase: !this.state.showPhrase}, () => {
        this.fadeText(1);

        // Read phrase on the screen reader if applicable
        if (this.state.showPhrase) {
          const phrase = this.state.currentPhrase;
          const text = this.state.tamilToEnglish ? phrase.original : phrase.translation;
          AccessibilityInfo.announceForAccessibility(text);
        }
      });
    })
  };

  componentDidMount() {
    this.fadeIn();
  }

  componentWillUnmount() {
    clearTimeout(this.state.waiting);
  }

  render() {
    const { Colours, Styles } = this.getTheme();
    const { state } = this;

    const phrase = state.currentPhrase;
    let text = state.tamilToEnglish ? phrase.original : phrase.translation;
    const script = !state.tamilToEnglish ? phrase.script : '';
    const scaleFactor = Math.floor((text.length + script.length) / 40) + 2;
    const accessibilityLabel = state.showPhrase ? "Hides translation" : "Reveals translation";

    if (!state.tamilToEnglish) text += '\n' + phrase.script;
    const btnLabel = state.questionNum == state.numQuestions ? 'Finish' : 'Next';

    return (
      <Container>
        <PhraseController ref={x => this.phraseController = x} />
        <Animated.View
          style={[Layout.p2, {
            backgroundColor: Colours.primary,
          }]}
        >
          <View style={[Layout.row, {justifyContent: 'flex-end'}]}>
            <Text colour={Colours.primaryContrast}>{state.questionNum + '/' + state.numQuestions}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[
          Layout.row, Layout.aCenter, Layout.p2,
          {
            backgroundColor: Colours.primary,
          }
        ]}>
          <Phrase
            onPress={() => this.playQuestion()}
            phrase={state.currentPhrase}
            isTranslation={state.tamilToEnglish}
          />
        </Animated.View>
        <View
          style={[
            Layout.f1, Layout.px2,
            Layout.aCenter,
            {
              justifyContent: 'space-evenly',
            }
          ]}
        >
          <Animated.View
            style={[
              Styles.roundCorner,
              {
                borderColor: Colours.offGrey,
                borderWidth: 1,
                width: '100%',
                height: StyleConstants.iconWidth * scaleFactor,
                backgroundColor: Colours.primary,
                opacity: state.opacity,
              }
            ]}
          >
            <Pressable
              style={[
                Layout.center, Styles.roundCorner,
                {height: StyleConstants.iconWidth * scaleFactor}
              ]}
              backgroundColour={Colours.primary}
              borderlessRipple={true}
              onPress={this.toggleText}
              accessibilityLabel={accessibilityLabel}
            >
              <Text
                animated bold align="center"
                colour={Colours.primaryContrast}
                style={{opacity: state.textOpacity}}
              >
                {state.showPhrase ? text : '?'}
              </Text>
            </Pressable>
          </Animated.View>
          <View style={{height: 50, width: 150, opacity: 1}}>
            <Button label={btnLabel} icon="chevron-right" onPress={this.nextQuestion} />
          </View>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

export default connect(mapStateToProps)(Flashcards);
