'use strict';

import React from 'react';
import {
  Animated,
  asset,
  Image,
  View,
} from 'react-vr';

const Easing = require('Easing');


class LoadingSpinner extends React.Component {

  static defaultProps = {
    delay: 500,
    height: 0.5,
    rotateY: 0,
    source: asset('circle_ramp.png'),
    speed: 1500,
    translateZ: 0,
    width: 0.5,
  };

  constructor(props) {
    super();
    this.state = {
      rotationAnim: new Animated.Value(0),
      opacityAnim: new Animated.Value(0),
    };

  }

  _rotationAnimate() {
    this.state.rotationAnim.setValue(0);
    Animated.timing(
      this.state.rotationAnim,
      {
        duration: this.props.speed,
        easing: Easing.linear,
        toValue: -360,
      }
    ).start((status) => {
      status.finished && this._rotationAnimate();
    });
  }

  componentDidMount() {
    Animated.timing(
      this.state.opacityAnim,
      {
        delay: this.props.delay,
        duration: this.props.speed,
        easing: Easing.linear,
        toValue: 1,
      }
    ).start();
    this._rotationAnimate();
  }

  render() {

    return (
      <Animated.View
        style={{
          opacity: this.state.opacityAnim,
          transform: [
            {rotateY: this.props.rotateY},
            {rotateZ: this.state.rotationAnim},
            {translateZ: this.props.translateZ},
          ],
        }}
      >
        <Image
          style={{
            height: this.props.height,
            width: this.props.width,

          }}
          source={this.props.source}
        >
        </Image>
      </Animated.View>
    );
  }
}

module.exports = LoadingSpinner;
