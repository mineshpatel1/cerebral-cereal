
import React, { Component } from 'react';
import { View } from 'react-native';

import LocalUtils from '../utils';

/**
 * Only one of these should exist in any given component.
 * It ensures only one audio phrase clip is playing at any
 * given time by referencing this component and using the
 * play method.
*/
export default class PhraseController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: null,
      playingSound: null,
    }
  }

  _playSound = asset => {
    const phraseSound = LocalUtils.playSound(asset, () => {
      if (this.props.onPlayEnd) this.props.onPlayEnd();
      this.setState({isPlaying: null, playingSound: null});
    });
    if (this.props.onPlay) this.props.onPlay(phraseSound);
    this.setState({isPlaying: asset, playingSound: phraseSound});
  }

  _handlePlay = (asset) => {
    const { state } = this;
    // If nothing is playing, play the phrase
    if (state.isPlaying === null) {
      this._playSound(asset, null);
    } else if (state.isPlaying != asset) {
      // If a different phrase is selected, stop and play the new phrase
      state.playingSound.stop(() => {
        this._playSound(asset, null);
      });
    }
  }

  playPhrase = phrase => {
    this._handlePlay('phrase_' + phrase.id);
  }

  playLetter = (vowel=null, consonant=null) => {
    let letterAsset;
    if (!vowel && !consonant) {
      console.error("One of vowel and consonant must be specified.");
      return;
    } else if (!vowel) {
      letterAsset = 'consonant_' + consonant;
    } else if (!consonant) {
      letterAsset = 'vowel_' + vowel;
    } else {
      letterAsset = 'letter_' + consonant + '_' + vowel;
    }
    this._handlePlay(letterAsset);
  }

  componentWillUnmount() {
    if (this.state.isPlaying) {
      this.state.playingSound.stop();
    }
  }

  render() {
    return (
      <View style={{display: 'none'}}/>
    )
  }
}
