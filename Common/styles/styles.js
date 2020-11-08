import { StyleSheet } from 'react-native';
import { StyleConstants } from './StyleConstants';

export const genStyles = Colours => {
  return StyleSheet.create({
    iconWidth: { width: StyleConstants.iconWidth },
    link: { textDecorationLine: 'underline' },
    paragraph: { lineHeight: 28 },
    roundCorner: { borderRadius: 25 },
    badge: {
      minWidth: 15,
      height: 15,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colours.error,
    },
    checkbox: {
      height: 32,
      width: 32,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuter: {
      justifyContent: 'center',
      alignItems: 'center',
      height: StyleConstants.size3,
      width: StyleConstants.size3,
      borderWidth: 2,
      borderRadius: StyleConstants.size3 / 2,
    },
    radioInner: {
      justifyContent: 'center',
      alignItems: 'center',
      height: StyleConstants.size3 / 2,
      width: StyleConstants.size3 / 2,
      borderRadius: (StyleConstants.size3 / 2) / 2,
    },
    modalBackground: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: StyleConstants.size4,
      borderRadius: 5,
      backgroundColor: Colours.background,
      shadowColor: Colours.black,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    screenCover: {
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      position: 'absolute',
    },
    overlay: {
      padding: StyleConstants.size1,
      backgroundColor: Colours.offGrey,
      borderRadius: 5,
    },
    textInput: {
      borderBottomWidth: 1,
      borderColor: Colours.foreground,
      paddingLeft: StyleConstants.size1 / 2,
      paddingBottom: StyleConstants.size1,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: StyleConstants.size1,
      justifyContent: 'space-between',
    },
    switchList: {
      marginTop: StyleConstants.size2,
      marginBottom: StyleConstants.size1,
      borderBottomWidth: 1,
      borderColor: Colours.disabled,
    },
  });
};

