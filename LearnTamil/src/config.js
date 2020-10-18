const packageJson = require('../package.json');

export const version = packageJson.version;
export const animationDuration = 300;
export const questionWaitTime = 1.5;

export const defaultSettings = {
  numQuestions: {
    default: 10,
    choices: [10, 15, 25, 50],
    type: 'int',
    label: '# of Questions',
  },
  randomisePractise: {
    default: false,
    type: 'bool',
    label: 'Shuffle By Default',
    description: 'Practise phrases are randomly shuffled.',
  },
  colourTheme: {
    default: 'System Default',
    choices: ['System Default', 'Dark', 'Light'],
    type: 'string',
    label: 'Colour Theme',
  },
  clearProgress: {
    default: "Click to remove app data of quiz scores from your phone.",
    type: 'string',
    label: 'Clear Progress',
  },
  version : {
    default: version,
    type: 'string',
    label: 'Version',
  }
}