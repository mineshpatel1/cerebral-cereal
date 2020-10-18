const packageJson = require('../package.json');

export const version = packageJson.version;
export const timeRegex = /(\d.*\sminutes|\d.*\sminute)/;

export const defaultSettings = {
  colourTheme: {
    default: 'System Default',
    choices: ['System Default', 'Dark', 'Light'],
    type: 'string',
    label: 'Colour Theme',
  },
  version : {
    default: version,
    type: 'string',
    label: 'Version',
  }
}
