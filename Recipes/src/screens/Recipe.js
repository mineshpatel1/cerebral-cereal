import React from 'react';
import { Dimensions, View } from 'react-native';
import Slider from '@react-native-community/slider';

import {
  Component, Container, Button, Drawer, HorizontalMenu, PlainButton, Pressable, Timer, Text,
  Layout, StyleConstants,
} from 'cerebral-cereal-common';

import MethodTab from './tabs/MethodTab';
import IngredientsTab from './tabs/IngredientsTab';
import IngredientChecklist from '../components/IngredientChecklist';
import NotifService from '../services/NotifService';
import { recipes, cuisines } from '../data';
import { timeRegex } from '../config';

const maxWidth = Dimensions.get('window').width;

export default class Recipe extends Component {
  constructor(props) {
    super(props);

    this.notif = new NotifService();
    this.recipe = recipes.filter(r => r.id == props.route.params.recipe)[0];
    this.timers = this.getTimers(this.recipe.method);
    this.timerArray = [];
    this.timerRefs = {};

    this.state = {
      servingSize: this.recipe.serving_size,
      showTimers: false,
      showChecklist: false,
      timeLeft: 0,
      notifIds: {},
    }
  }

  cancelNotif = step => {
    if (this.state.notifIds[step] !== undefined) {
      this.notif.cancel(this.state.notifIds[step]);
    }
  }

  scheduleNotify = (step, timeLeft) => {
    const { Colours } = this.getTheme();

    let notifIds = this.state.notifIds;
    this.notif.getScheduledLocalNotifications(notifs => {
      let isScheduled = false;
      notifs.forEach(notif => {
        if (notifIds[step] == notif.id) isScheduled = true;
      });

      if (!isScheduled) {
        const notifId = this.notif.schedule(
          this.recipe.name,
          'Alarm for Step ' + (step + 1),
          timeLeft / 1000,
          Colours.primary,
        );
        notifIds[step] = notifId;
        this.setState({notifIds});
      }
    });
  }

  toggleTimers = () => {
    this.setState({showTimers: !this.state.showTimers});
  }

  getTimers = method => {
    const timers = [];
    method.forEach((step, i) => {
      step.split(timeRegex).forEach((part, j) => {
        if (j % 2 == 1) {
          const parse = part.match(/(\d.*?)\s/);
          if (parse) {
            timers.push({step: parseInt(i), time: 60 * parseInt(parse[1])});
          }
        }
      });
    });
    return timers;
  }

  refresh = () => this.setState({});

  toggleMethod = () => {
    this.setState({methodCollapsed: !this.state.methodCollapsed});
  }

  // Fetches the ID of the timer with the least time remaining
  shortestTimer = () => {
    let playingTimer = null;
    let playingStep = null;
    let timeLeft = null;
    for (const step in this.timerRefs) {
      const timer = this.timerRefs[step];
      if (timer.state.playing) {
        if (!playingTimer) {
          playingTimer = timer;
          playingStep = step;
          timeLeft = timer.state.timeLeft;
        } else {
          if (playingTimer.state.timeLeft > timer.state.timeLeft) {
            playingTimer = timer;
            playingStep = step;
            timeLeft = timer.state.timeLeft;
          }
        }
      }
    }
    return {timeLeft, step: playingStep};
  }

  timerUpdate = timeLeft => this.setState({timeLeft});

  play = (step, callback) => {
    const timer = this.timerRefs[step];
    timer.start(callback);
    this.scheduleNotify(step, timer.state.timeLeft);
  }

  pause = (step, callback) => {
    this.timerRefs[step].stop(callback);
    this.cancelNotif(step);
  }

  componentWillUnmount() {
    this.notif.cancelAll();
  }

  renderTimers = () => {
    const { Colours } = this.getTheme();
    const IconButton = props => (
      <PlainButton
        icon={props.icon}
        onPress={props.onPress}
        textSize={18}
        size={42}
      />
    )
    
    const colStyle = [Layout.f1, Layout.row, Layout.center, this.props.style];
    return (
      <Container>
        <View style={[Layout.p2, Layout.mb2, {backgroundColor: Colours.primary}]}>
          <Text bold colour={Colours.primaryContrast}>Timers</Text>
        </View>
        <View>
          {this.timers.map(t => {
            const timer = this.timerRefs[t.step];
            const isPlaying = timer && timer.state.playing;
            const control = isPlaying ? 'pause' : 'play';

            return (
              <View key={t.step} style={[Layout.px2, Layout.row, Layout.mb1]}>
                <View style={[colStyle, {justifyContent: 'flex-start'}]}>
                  <Text>{"Step " + (t.step + 1)}</Text>
                </View>
                <View style={colStyle}>
                  <Timer
                    length={t.time}
                    ref={x => {this.timerRefs[t.step] = x;}}
                    style={Layout.ml1}
                    auto={false}
                  />
                </View>
                <View style={colStyle}>
                  <IconButton icon={control} onPress={() => this[control](t.step, this.refresh)} />
                  <IconButton icon="redo" onPress={() => this.timerRefs[t.step].reset(this.refresh)} />
                </View>
              </View>
            );
          })}
        </View>
      </Container>
    );
  }

  renderTabs() {
    return [
      {element: (
        <IngredientsTab
          ingredients={this.recipe.ingredients}
          servingSize={this.state.servingSize}
          baseServingSize={this.recipe.serving_size}
        />
      )},
      {element: (
        <MethodTab
          method={this.recipe.method}
          onLink={step => {
            if (!this.timerRefs[step].state.playing) {
              this.play(step, () => {
                this.setState({showTimers: true});
              });
            } else {
              this.setState({showTimers: true});
            }
          }}
        />
      )},
    ];
  }

  render() {
    const { state } = this;
    const { Colours, Styles } = this.getTheme();
    const {timeLeft, step} = this.shortestTimer();
    const servingRatio = this.state.servingSize / this.recipe.serving_size;
    
    return (
      <Drawer
        drawer={this.renderTimers()}
        isOpen={state.showTimers}
        onRequestClose={() => {this.setState({showTimers: false})}}
      >
        <Container>
          <IngredientChecklist
            visible={state.showChecklist}
            ingredients={this.recipe.ingredients}
            servingRatio={servingRatio}
            onRequestClose={() => this.setState({showChecklist: false})}
          />
          <View style={[
            Layout.row, Layout.px2, Layout.pt2,
            {
              justifyContent: 'space-between',
            }
          ]}>
            <View style={[Layout.row, Layout.aCenter]}>
              <Text>Cuisine: </Text>
              <Text>{cuisines[this.recipe.cuisine_id - 1].name}</Text>
            </View>
            <View style={Layout.row}>
              <View style={[Styles.iconWidth, Layout.mr1]}>
                <Button
                  icon="stopwatch"
                  onPress={() => this.setState({showTimers: true})}
                />
              </View>
              <View style={[Styles.iconWidth]}>
                <Button icon="cart-plus" onPress={() => this.setState({showChecklist: true})} />
              </View>
            </View>
          </View>
          <View style={[
            Layout.row, Layout.p2, Layout.aCenter,
            {
              borderBottomWidth: 2,
              borderColor: Colours.primary,
            }
          ]}>
            <Text style={Layout.pr2}>{"Serves " + state.servingSize}</Text>
            <Slider
              thumbTintColor={Colours.primary}
              minimumTrackTintColor={Colours.primary}
              maximumTrackTintColor={Colours.disabled}
              style={[Layout.f1]} value={state.servingSize}
              step={1} minimumValue={1} maximumValue={16}
              onSlidingComplete={val => this.setState({servingSize: val})}
            />
          </View>
          <HorizontalMenu
            screens={this.renderTabs()}
            tabs={['Ingredients', 'Method']}
            width={maxWidth}
          />
          <View
            style={[
              Layout.row, Layout.aCenter,
              {
                justifyContent: 'flex-end',
                borderTopWidth: 2,
                borderColor: Colours.primary,
                height: StyleConstants.iconWidth,
              }
            ]}
          >
            <Pressable
              style={[Layout.p1, Layout.row]}
              onPress={() => this.setState({showTimers: true})}
              backgroundColour={Colours.background}
            >
              {
                timeLeft !== null &&
                <>
                  <Text style={Layout.mr1}>{('Step ' + (parseInt(step) + 1))}</Text>
                  <Timer timeLeft={timeLeft} length={Math.ceil(timeLeft / 1000)} />
                </>
              }
            </Pressable>
          </View>
        </Container>
      </Drawer>
    )
  }
}

