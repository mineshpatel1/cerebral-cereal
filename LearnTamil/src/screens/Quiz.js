import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Animated } from 'react-native';

import {
    Button, Component, Container, Text,
    Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { phrases } from '../data';
import { questionWaitTime } from '../config';
import { answerQuestion } from '../actions/ProgressActions';
import PhraseController from '../components/PhraseController';
import Phrase from '../components/Phrase';
import QuizOption from '../components/QuizOption';

const numOptions = 4;

function shufflePhrases(allPhrases) {
  allPhrases = Utils.shuffle(allPhrases.slice());
  let currentPhrase = allPhrases.shift();
  
  let options = [currentPhrase];
  for (let i = 0; i < numOptions - 1; i++) {
    options.push(allPhrases[i]);
  }
  options = Utils.shuffle(options);
  return {currentPhrase, allPhrases, options};
}

class Quiz extends Component {
  static defaultProps = {
    animationDuration: 300,
  }

  constructor(props) {
    let _allPhrases = [];
    props.route.params.categories.forEach(categoryId => {
      _allPhrases = _allPhrases.concat(phrases[categoryId]);
    })
    const {currentPhrase, allPhrases, options} = shufflePhrases(_allPhrases);

    super(props);
    this.state = {
      tamilToEnglish: props.route.params.tamilToEnglish,
      allPhrases: allPhrases,
      currentPhrase: currentPhrase,
      numQuestions: Math.min(props.settings.numQuestions,  _allPhrases.length - (numOptions - 1)),
      options: options,
      opacity: new Animated.Value(0),
      allOpacity: new Animated.Value(1),
      questionNum: 1,
      score: 0,
      locked: false,
      gameIsOver: false,
      waiting: null,
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

  playQuestion = () => {
    this.phraseController.playPhrase(this.state.currentPhrase);
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

  answerQuestion = (answer) => {
    let { props, state } = this;

    if (!state.locked) {
      let score = state.score;
      let isCorrect = false;

      this.optionRefs[answer.id].highlight();
      if (answer.id == state.currentPhrase.id) {
        isCorrect = true;
        score++;
      } else {
        this.optionRefs[state.currentPhrase.id].highlight();
      }

      props.answerQuestion(isCorrect, state.currentPhrase.categoryId);
      this.setState(
        {score, locked: true},
        () => {
          const timeout = setTimeout(this.questionEnd, questionWaitTime * 1000);
          this.setState({ waiting: timeout });
        },
      );
    }
  }
  
  questionEnd = () => {
    let {state} = this;
    this.fadeOut(() => {
      if (state.questionNum < state.numQuestions) {
        this.nextQuestion();
      } else {
        this.gameOver();
      }
    });
  }

  nextQuestion = () => {
    const { state } = this;

    if (!state.gameIsOver) {
      for (const opt of Object.values(this.optionRefs)) {
        if (opt) opt.reset();
      }
  
      const {
        currentPhrase, allPhrases, options
      } = shufflePhrases(state.allPhrases);
  
      this.setState({
        allPhrases, currentPhrase, options,
        questionNum: state.questionNum + 1,
        locked: false, waiting: null,
      }, this.fadeIn);
    }
  }

  gameOver = () => {
    this.setState({gameIsOver: true, waiting: null}, () => {
      Utils.animate(
        this.state.allOpacity, 0,
        {
          duration: this.props.animationDuration,
        },
      )
    });
  }

  componentDidMount() {
    this.fadeIn();
  }

  componentWillUnmount() {
    clearTimeout(this.state.waiting);
  }

  render() {
    const { Colours } = this.getTheme();
    const { props, state } = this;
    this.optionRefs = {};

    const optionButtons = [];
    state.options.forEach((opt, i) => {
      const highlight = opt.id == state.currentPhrase.id ? Colours.success : Colours.error;
      const margin = i == state.options.length - 1 ? Layout.mb2 : null;

      const text = state.tamilToEnglish ? opt.original : opt.translation;
      const script = !state.tamilToEnglish ? opt.script : '';
      const scaleFactor = Math.floor((text.length + script.length) / 40) + 2;

      optionButtons.push(
        <QuizOption
          key={i}
          phrase={opt}
          highlight={highlight}
          onPress={() => { this.answerQuestion(opt); }}
          onPlay={() => { this.phraseController.playPhrase(opt) }}
          ref={x => this.optionRefs[opt.id] = x}
          original={state.tamilToEnglish}
          height={StyleConstants.iconWidth * scaleFactor}
          style={margin}
        />
      )
    });


    return (
      <Container>
        <PhraseController ref={x => this.phraseController = x} />
        {
          !state.gameIsOver && 
          <>
            <Animated.View
              style={[Layout.pd2, {
                backgroundColor: Colours.primary,
                opacity: state.allOpacity,
              }]}
            >
              <View style={[Layout.row, {justifyContent: 'space-between'}]}>
                <Text colour={Colours.primaryContrast}>{'Score: ' + state.score}</Text>
                <Text colour={Colours.primaryContrast}>{state.questionNum + '/' + state.numQuestions}</Text>
              </View>
            </Animated.View>
            <Animated.View style={[
              Layout.row, Layout.aCenter, Layout.pd2,
              {
                backgroundColor: Colours.primary,
                opacity: state.allOpacity,
              }
            ]}>
              <Phrase
                onPress={() => this.playQuestion()}
                phrase={state.currentPhrase}
                isTranslation={state.tamilToEnglish}
              />
            </Animated.View>
            <Animated.ScrollView style={[Layout.pdx2, {paddingTop: 0, opacity: state.opacity}]}>
              {optionButtons}
            </Animated.ScrollView>
          </>
        }
        {
          state.gameIsOver &&
          <Animated.View
            style={[
              Layout.center, Layout.f1, Layout.pd2,
              {
                opacity: state.allOpacity.interpolate({
                  inputRange: [0, 1], outputRange: [1, 0]
                }),
              },
            ]}
          >
            <Text display>Quiz Over</Text>
            <Text bold style={Layout.mt1 }>
              {'Score: ' + state.score + '/' + state.numQuestions}
            </Text>
            <Button
              style={Layout.mt2}
              label={'Return Home'}
              onPress={() => props.navigation.navigate('Home')}
            />
          </Animated.View>
        }
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ answerQuestion }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
