import Sound from 'react-native-sound';
import { Utils } from 'cerebral-cereal-common';

class LocalUtils {
  constructor() {}
  static playPhrase = (id, callback=null) => {
    const soundAsset = 'phrase_' + id;
    return this.playSound(soundAsset, callback);
  }

  static playSound = (clip, callback=null) => {
    const soundAsset = clip + '.mp3';
    const sound = new Sound(soundAsset, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn("Audio asset not found: " + soundAsset);
        return;
      }
      sound.play(() => {
        if (callback) callback();
        sound.release();
      });
    });
    return sound;
  }

  static shufflePhrases(allPhrases, numOptions) {
    allPhrases = Utils.shuffle(allPhrases.slice());
    let currentPhrase = allPhrases.shift();
    
    let options = [currentPhrase];
    for (let i = 0; i < numOptions - 1; i++) {
      options.push(allPhrases[i]);
    }
    options = Utils.shuffle(options);
    return {currentPhrase, allPhrases, options};
  }
}

export default LocalUtils;