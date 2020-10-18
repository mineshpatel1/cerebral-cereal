import React from 'react';
import { connect } from 'react-redux';
import { Animated, Dimensions, ScrollView, View } from 'react-native';

import {
  Component, Icon, Pressable, ScreenContainer, Text,
  Layout, StyleConstants, Utils,
} from 'cerebral-cereal-common';

import { categories } from '../../data';
const maxWidth = Dimensions.get('window').width;

class ProgressMenu extends Component {
  static defaultProps = {
    navigation: null,
    animationDuration: 250,
  }

  constructor(props) {
    super(props);
    const textWidths = {}
    categories.forEach(category => {
      textWidths[category.id] = new Animated.Value(0);
    });
    this.state = {
      textWidths: textWidths,
    }
  }

  showText = (categoryId, value) => {
    Utils.animate(
      this.state.textWidths[categoryId], value,
      {
        duration: this.props.animationDuration,
        native: false,
      },
    )
  }

  render() {
    const { Colours } = this.getTheme();
    const { props } = this;
    const rowStyle = [Layout.row, Layout.mt2, Layout.aCenter];

    let categoryElements = [];
    let progressElements = [];
    let pctElements = [];

    let overallAttemped = 0;
    let overallCorrect = 0;

    categories.forEach(category => {
      const catProgress = props.progress[category.id];

      if (catProgress) {
        overallAttemped += catProgress.attempted;
        overallCorrect += catProgress.correct;
      }

      const catSuccess = catProgress ? catProgress.correct / catProgress.attempted : 0;
      const width1 = Math.round(catSuccess * 100);
      const width2 = Math.round((1 - catSuccess) * 100);
      const pctText = catProgress ? width1 + '%' : '';

      const numAttempts = catProgress ? catProgress.correct + '/' + catProgress.attempted : null
      const progressColour = catProgress ? Colours.primary : Colours.background;
      const barColour = catProgress ? Colours.offGrey : Colours.background;
      const maxLabelWidth = maxWidth - ((StyleConstants.iconWidth * 2) + 32);
      const labelWidth = catProgress
      ? this.state.textWidths[category.id].interpolate({
        inputRange: [0, 1],
        outputRange: [0, maxLabelWidth],  // Should be exactly the distance
      })
      : maxLabelWidth;

      categoryElements.push(
        <View key={category.id} style={[Layout.row, Layout.center, {height: StyleConstants.iconWidth}]}>
          <View style={[Layout.col]}>
            <View style={rowStyle}>
              <Icon size={20} icon={category.icon} style={Layout.mr2} />
              <Pressable
                highlight={false}
                backgroundColour={Colours.background}
                onPress={() => this.showText(category.id, 0)}
              >
                <Animated.View style={[
                  Layout.row,
                  Layout.aCenter,
                  {
                    height: 24,
                    width: labelWidth,
                  }
                ]}>
                  <View style={[Layout.row, {width: maxLabelWidth}]}>
                    <Text style={Layout.mr1}>{category.name}</Text>
                    <Text style={[Layout.f1, Layout.mr1]} align="right">{numAttempts}</Text>
                  </View>
                </Animated.View>
              </Pressable>
            </View>
          </View>
          <View style={[Layout.col, Layout.f1]}>
            <Pressable
              highlight={false}
              backgroundColour={Colours.background}
              onPress={() => {if (catProgress) this.showText(category.id, 1)}}
            >
              <View style={rowStyle}>
                <View style={[{width: width1 + '%', height: 24, backgroundColor: progressColour} ]}/>
                <View style={[{width: width2 + '%', height: 24, backgroundColor: barColour} ]}/>
              </View>              
            </Pressable>
          </View>
          <View style={[Layout.col, {width: 48, alignItems: 'flex-end'}]}>
            <View style={rowStyle}>
              <Text align="right" style={{width: 48}}>{pctText}</Text>
            </View>
          </View>
        </View>
      )
    });

    const overallPct = overallAttemped > 0 ? Math.round((overallCorrect / overallAttemped) * 100) + '%' : '0%';
    return (
      <ScreenContainer>
        <View style={[{alignItems: 'flex-end', paddingBottom: 8, borderBottomColor: Colours.background, borderBottomWidth: 1}]}>
          <View style={Layout.row}>
            <Text bold style={Layout.mr2}>Overall: </Text>
            <Text bold align="right" style={Layout.mr1}>{overallCorrect + '/' + overallAttemped}</Text>
            <Text bold align="right" style={{width: 48}}>{overallPct}</Text>
          </View>          
        </View>
        <ScrollView>
          <View style={[Layout.row, Layout.f1, {paddingBottom: 16}]}>
            <View style={[Layout.col, Layout.f1]}>
              {categoryElements}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    progress: state.progress,
  }
};

export default connect(mapStateToProps)(ProgressMenu);
