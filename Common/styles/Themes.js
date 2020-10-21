import { BaseColours, Colours } from './colours';
import { Fonts } from './fonts';
import { genStyles } from './styles';
import { Utils } from '../utils/Utils';

const darkTheme = Utils.clone(Colours);
const lightTheme = Utils.update(
  Utils.clone(Colours),
  {
    background: BaseColours.white,
    foreground: BaseColours.raisinBlack,
    disabled: BaseColours.silver,
    offGrey: BaseColours.gainsboro,
    iconHighlight: BaseColours.bluetiful,
  }
);

export const Themes = {
  dark: {
    Colours: darkTheme,
    Fonts: Fonts,
    Styles: genStyles(darkTheme),
  },
  light: {
    Colours: lightTheme,
    Fonts: Fonts,
    Styles: genStyles(lightTheme),
  },
}