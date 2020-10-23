export const BaseColours = {
  black: '#000000',
  raisinBlack: '#22222E',
  charcoal: '#313B50',
  independence: '#4A5160',
  sonicSilver: '#6E727B',
  romanSilver: '#8A8F9A',
  silver: '#ADB0B6',
  gainsboro: '#E0E2E6',
  white: '#FFFFFF',

  fireEngineRed: '#CF2B2B',
  seaGreen: '#288541',
  greenPigment: '#2E9E4C',
  bluetiful: '#315FEA',
  blueCrayola: '#4772F3',
  periwinkle: '#BFCBF0',
  wildBlueYonder: '#ADBDEC',
  burntSienna: '#F36E49',
}

export const Colours = {
  background: BaseColours.raisinBlack,
  foreground: BaseColours.white,
  primary: BaseColours.bluetiful,
  primaryContrast: BaseColours.white,
  primaryLight: BaseColours.wildBlueYonder,
  offGrey: BaseColours.charcoal,  // Close to background colour
  disabled: BaseColours.romanSilver,
  error: BaseColours.fireEngineRed,
  success: BaseColours.seaGreen,

  // For specfic differences between themes
  iconHighlight: BaseColours.white,

  // Specific hardcoded colours
  black: BaseColours.black,
};