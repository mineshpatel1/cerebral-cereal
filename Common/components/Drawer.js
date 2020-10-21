import React from 'react';
import { Animated, Dimensions, PanResponder, Pressable, View } from 'react-native';

import { Component } from './Component';
import { Layout } from '../styles/Layout';
import { Utils } from '../utils/Utils';

const deviceScreen = Dimensions.get('window');

export class Drawer extends Component {
  static defaultProps = {
    drawer: null,
    openDrawerOffset: 0.2,
    isOpen: false,
    onRequestClose: null,
    animationDuration: 300,
    draggable: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewport: deviceScreen,
      drawerPos: new Animated.Value(props.isOpen ? 0 : -1 * this.getDrawerWidth(deviceScreen)),
      animating: false,
    };

    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return (
          this.state.animating || !this.props.draggable ?
          false : true
        );
      },
      onPanResponderGrant: () => {
        this.state.drawerPos.setOffset(this.state.drawerPos._value);
      },
      onPanResponderMove: (_, gestureState) => {
        const { state } = this;
        if (gestureState.dx < 0) {
          state.drawerPos.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        this.state.drawerPos.flattenOffset();
        if (gestureState.dx < (-0.4 * this.getDrawerWidth())) {
          // Close the drawer and update state
          this.animateDrawer(false, () => {
            setTimeout(this.onRequestClose);  // Ensures the closing animation is smooth
          })
        } else {
          this.animateDrawer(true);  // Reopen the drawer all the way
        }
      },
    });
  }

  getDrawerWidth = (viewport=null) => {
    viewport = viewport || this.state.viewport;
    return viewport.width * (1 - this.props.openDrawerOffset)
  };

  setViewport = e => {
    this.setState({
      viewport: e.nativeEvent.layout,
    });
  }

  onRequestClose = () => {
    if (this.props.onRequestClose) this.props.onRequestClose();
  }

  animateDrawer = (open, callback=null) => {
    this.setState({animating: true});
    Utils.animate(
      this.state.drawerPos,
      open ? 0 : -1 * this.getDrawerWidth(),
      {
        duration: this.props.animationDuration,
        native: false,
        callback: () => {
          this.setState({animating: false});
          if (callback) callback();
        }
      },
    );
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (props.isOpen !== prevProps.isOpen) {
      this.animateDrawer(props.isOpen);
    }
  }

  // Main content panel, contains component children
  renderMain() {
    const { state } = this;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          height: state.viewport.height,
          width: state.viewport.width,
          left: 0, top: 0,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  // Side drawer menu sliding over the main content
  renderDrawer() {
    const { state, props } = this;
    const drawerWidth = this.getDrawerWidth();

    let drawerPos = state.drawerPos;

    return (
      <Animated.View
        style={[{
          position: 'absolute',
          height: state.viewport.height,
          width: drawerWidth,
          top: 0,
          left: drawerPos,
        }]}
        {...this.responder.panHandlers}
      >
        {props.drawer}
      </Animated.View>
    )
  }

  // Fades out the main content behind the drawer and becomes
  // clickable so that the menu can be closed
  renderOverlay() {
    const { Colours } = this.getTheme();
    const { state, props } = this;
    const overlay = {
      position: 'absolute',
      height: state.viewport.height,
      width: state.viewport.width,
      left: 0, top: 0,
    };
    const pointer = props.isOpen ? 'auto': 'none';
    const accessibilityLabel = (
      props.isOpen ?
      "Exit settings menu." :
      "No action as the settings menu is closed."
    );

    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        onPress={this.onRequestClose}
        pointerEvents={pointer}
        style={overlay}
      >
        <Animated.View
          style={[Layout.f1, {
            backgroundColor: Colours.black,
            opacity: state.drawerPos.interpolate({
              inputRange: [-1 * this.getDrawerWidth(), 0],
              outputRange: [0, 0.7],
            }),
          }]}
        />
      </Pressable>
    );
  }

  render() {   
    return (
      <View
        style={[Layout.f1, Layout.center]}
        onLayout={this.setViewport}
      >
        {this.renderMain()}
        {(this.state.animating || this.props.isOpen) && this.renderOverlay()}
        {this.renderDrawer()}
      </View>
    )
  }
}

