export const BaseColours = {
  black: '#000000',
  raisinBlack: '#22222E',
  charcoal: '#313B50',
  independence: '#4A5160',
  coral: '#62666F',
  silver: '#ADB0B6',
  gainsboro: '#E0E2E6',
  white: '#FFFFFF',

  fireEngineRed: '#CF2B2B',
  greenPigment: '#2E9E4C',
  blueCrayola: '#4772F3',
  periwinkle: '#BFCBF0',
  burntSienna: '#F36E49',
}

export const Colours = {
  background: BaseColours.raisinBlack,
  foreground: BaseColours.white,
  primary: BaseColours.blueCrayola,
  primaryContrast: BaseColours.white,
  primaryLight: BaseColours.periwinkle,
  offGrey: BaseColours.charcoal,  // Close to background colour
  disabled: BaseColours.coral,
  error: BaseColours.fireEngineRed,
  success: BaseColours.greenPigment,

  // For specfic differences between themes
  iconHighlight: BaseColours.white,

  // Specific hardcoded colours
  black: BaseColours.black,
};