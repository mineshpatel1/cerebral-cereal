import { StyleSheet } from 'react-native';

export const BaseFonts = {
  josefinRegular: 'JosefinSans-Regular',
  josefinBold: 'JosefinSans-Bold',
  lobsterBold: 'LobsterTwo-Bold',
}

export const FontSize = {
  normal: 18,
  medium: 22,
  large: 26,
};

export const Fonts = {
  normal: BaseFonts.josefinRegular,
  bold: BaseFonts.josefinBold,
  display: BaseFonts.lobsterBold,
}

export const genFonts = Fonts => {
  return StyleSheet.create({
    normal: {
      fontFamily: Fonts.normal,
      fontSize: FontSize.normal,
    },
    bold: {
      fontFamily: Fonts.bold,
      fontSize: FontSize.normal,
    },
    display: {
      fontFamily: Fonts.display,
      fontSize: FontSize.large,
    },
  });
}
