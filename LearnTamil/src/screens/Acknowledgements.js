import React from 'react';
import { ScrollView, Linking } from 'react-native';

import { Component, Container, Text, Layout } from 'cerebral-cereal-common';

export default class Acknowledgements extends Component {
  render() {
    const { Styles } = this.getTheme();

    const P = props => <Text {...props} style={[Styles.paragraph, props.style]}>{props.children}</Text>;
    const B = props => <Text bold>{props.children}</Text>;
    const L = props => <Text link onPress={() => Linking.openURL(props.url)}>{props.children}</Text>;

    return (
      <Container style={Layout.pd2}>
        <ScrollView>
          <Text display text={"My Partner"} />
          <P style={Layout.mt1}>
            Special thanks to my partner for inspiring me to learn Tamil, recording
            hundreds of Tamil phrases and being infinitely patient with me whilst I agonised
            over colours and fonts.
          </P>

          <Text display style={Layout.mt3} text={"Our Friends & Family"} />
          <P style={Layout.mt1}>
            Thanks to all of our friends and family for helping with spelling, pronunciation
            and script translations.
          </P>

          <Text display style={Layout.mt3} text={"desidame4eva"} />
          <P style={Layout.mt1}>
            Thanks to <B>desidame4eva</B> for her wonderful series of videos teaching
            Tamil that I have used to produce this app.
          </P>
          <P style={Layout.mt2}>
            Please visit
            her <L url="https://www.youtube.com/watch?v=3kJu6F10rWs">YouTube channel</L> and
            watch the videos in full.
          </P>

          <Text display style={Layout.mt3}>Cerebeal Cereal</Text>
          <P style={Layout.mt1}>
            This app has been made with love by Cerebral Cereal and is intended to be free for
            use by anyone who wants it.
          </P>
        </ScrollView>
      </Container>
    )
  }
}

