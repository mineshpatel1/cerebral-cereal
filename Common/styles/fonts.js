import { StyleSheet } from 'react-native';

export const FontSize = {
  normal: 18,
  medium: 22,
  large: 26,
};

export const Fonts = StyleSheet.create({
  normal: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: FontSize.normal,
  },
  bold: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: FontSize.normal,
  },
  display: {
    fontFamily: 'LobsterTwo-Bold',
    fontSize: FontSize.large,
  },
});