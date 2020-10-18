import Sound from 'react-native-sound';

class AudioUtils {
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
}

export default AudioUtils;