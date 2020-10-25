import { BaseColours, Colours } from './colours';
import { Fonts, genFonts } from './fonts';
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
    disabled: BaseColours.sonicSilver,
  }
);

export const Themes = {
  dark: {
    Colours: darkTheme,
    Fonts: genFonts(Fonts),
    Styles: genStyles(darkTheme),
  },
  light: {
    Colours: lightTheme,
    Fonts: genFonts(Fonts),
    Styles: genStyles(lightTheme),
  },
}