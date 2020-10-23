import React from 'react';
import { connect } from 'react-redux';
import { Animated, Dimensions, ScrollView, View } from 'react-native';

import {
  Component, PlainButton, ScreenContainer, Text,
  Layout,
} from 'cerebral-cereal-common';

import ProgressBar from '../../components/ProgressBar';
import { categories } from '../../data';
const maxWidth = Dimensions.get('window').width;

class ProgressMenu extends Component {
  static defaultProps = {
    navigation: null,
    animationDuration: 250,
  }

  constructor(props) {
    super(props);
    const textWidths = {};
    const showStates = {};
    categories.forEach(category => {
      textWidths[category.id] = new Animated.Value(0);
      showStates[category.id] = false;
    });
    
    this.state = {
      textWidths,
      showStates,
    }
  }

  showText = (categoryId, value) => {
    let showStates = this.state.showStates;
    showStates[categoryId] = value;
    this.setState({showStates});
  }

  toggleAll = show => {
    const { props, state } = this;
    let showStates = state.showStates;
    categories.forEach(category => {
      const catProgress = props.progress[category.id];
      if (catProgress) showStates[category.id] = show;
    });
    this.setState({showStates});
  }

  render() {
    const { props, state } = this;

    let categoryElements = [];
    let overallAttemped = 0;
    let overallCorrect = 0;

    let allHidden = true;
    categories.forEach(category => {
      const catProgress = props.progress[category.id];
      if (catProgress) {
        overallAttemped += catProgress.attempted;
        overallCorrect += catProgress.correct;
        if (state.showStates[category.id]) allHidden = false;
      }

      categoryElements.push(
        <ProgressBar
          key={category.id}
          maxWidth={maxWidth}
          category={category}
          categoryProgress={catProgress}
          showText={state.showStates[category.id]}
          onPress={this.showText}
        />
      );
    });

    const overallPct = overallAttemped > 0 ? Math.round((overallCorrect / overallAttemped) * 100) + '%' : '0%';
    return (
      <ScreenContainer>
        <View style={[Layout.row, {justifyContent: 'space-between'}]}>
          <PlainButton
            size={40} textSize={20}
            accessibilityLabel={allHidden ? 'Show all' : 'Hide all'}
            icon={allHidden ? 'eye' : 'eye-slash'}
            onPress={() => this.toggleAll(allHidden)}
          />
          <View style={[Layout.jCenter]}>
            <View style={Layout.row}>
              <Text bold style={Layout.mr2}>Overall: </Text>
              <Text bold align="right" style={Layout.mr1}>{overallCorrect + '/' + overallAttemped}</Text>
              <Text bold align="right" style={{width: 48}}>{overallPct}</Text>
            </View>          
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
