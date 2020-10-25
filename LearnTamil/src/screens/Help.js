import React from 'react';
import { Linking, ScrollView, View } from 'react-native';

import { Component, Container, Text, Layout } from 'cerebral-cereal-common';
import LocalUtils from '../utils';

export default class Help extends Component {
  play = word => {
    LocalUtils.playSound('pronunciation_' + word);
  }

  render() {
    const { Styles } = this.getTheme();
    const P = (props) => <Text {...props} style={[Styles.paragraph, props.style]}>{props.children}</Text>;
    const B = (props) => <Text bold>{props.children}</Text>;
    const L = (props) => <Text link onPress={() => {
      if (props.play) this.play(props.play);
      if (props.navigate) this.props.navigation.navigate(props.navigate);
      if (props.link) Linking.openURL(props.link);
    }}>{props.children}</Text>;

    return (
      <Container style={Layout.pd2}>
        <ScrollView>
          <Text display>Formality</Text>
          <P style={[Layout.mt1]}>
            Many words and phrases in Tamil have formal and informal equivalents.
            Formal speech should be used when speaking to older people and authority
            figures. Informal speech is used amongst friends and peers.
          </P>
          <P style={[Layout.mt2]}>
            The English version of such phrases will be suffixed with <B>[f]</B> when
            denoting the formal version and with <B>[i]</B> when denoting the informal
            version.
          </P>

          <Text display style={Layout.mt3}>Pronunciation</Text>
          <P style={Layout.mt1}>
            Pronunciation is important in Tamil and there are some sounds that are
            similar but are pronunced slightly differently. The two examples of this will
            be written using uppercase letters for the hard enunciated version, and
            lowercase letters for the soft pronunciation:
          </P>
          <View style={[Layout.mt1, Layout.ml1]}>
            <P>• <L play='la'>la vs La</L></P>
            <P>• <L play='na'>na vs Na</L></P>
          </View>
          <P style={Layout.mt2}>
            The syallable <L play='zha'>'Zha'</L> is pronounced with an 'r' sound but
            often is said incorrectly with an 'l' sound. Even the name of the language,
            Tamil, should be pronounced <L play="tamizh">Thamizh</L>.
          </P>
          <P style={Layout.mt2}>
            In Tamil there are several letters that have interchangeable sounds. Generally
            it does not matter which sound is used in these cases but is worth knowing about
            which letters have multiple syllables:
          </P>
          <View style={[Layout.mt1, Layout.ml1]}>
            <P>• <L play='ka_ga'>ka or ga</L></P>
            <P>• <L play='pa_ba'>pa or ba</L></P>
            <P>• <L play='sa_cha'>sa or cha</L></P>
          </View>
          <Text display style={Layout.mt3}>Script</Text>
          <P style={Layout.mt1}>
            The current Tamil script consists of 12 vowels, 18 consonants and one special character,
            the āytam. The vowels and consonants combine to form 216 compound characters, giving a
            total of 247 characters (12 + 18 + 1 + (12 x 18)).
          </P>
          <P style={Layout.mt2}>
            All consonants have an inherent vowel
            a, as with other Indic scripts. This inherent vowel is removed by adding a tittle called
            a puḷḷi, to the consonantal sign. For example, ன is ṉa (with the inherent a) and ன் is ṉ
            (without a vowel). In addition to the standard characters, six characters taken from the
            Grantha script, which was used in the Tamil region to write Sanskrit, are sometimes used
            to represent sounds not native to Tamil.
          </P>
          <P style={Layout.mt2}>
            Use the <L navigate='Alphabet'>Alphabet</L> tool to familiarise yourself with the letters
            and their individual pronunciations.
          </P>
        </ScrollView>
      </Container>
    )
  }
}

