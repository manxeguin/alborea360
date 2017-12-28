'use strict';

import React from 'react';
import {
  Animated,
  Image,
  Text,
  View,
  VrButton,
} from 'react-vr';

import LoadingSpinner from './LoadingSpinner';

const Easing = require('Easing');
const VrSoundEffects = require('VrSoundEffects');

class NavButton extends React.Component {

  static defaultProps = {
    delay: 2000,
    height: 0.3,
    innerWidth: 0.3,
    isLoading: false,
    outerWidth: 0.5,
    onInput: null,
    rotateY: 0,
    scaleFactor: 1.3,
    textLabel: '',
    translateZ: 0,
  };

  constructor(props) {
    super();
    this.initialBorderWidth = (props.outerWidth - props.innerWidth) / 2;
    this.layoutFactor = (props.innerWidth + this.initialBorderWidth) / 2;
    this.ringWidth = 0.025;
    this.state = {
      borderWidthAnim: new Animated.Value(this.initialBorderWidth),
      hasFocus: false,
      lastTimeoutId: 0,
    };

  }

  componentWillUnmount() {
    if (this.state.lastTimeoutId) {
      clearTimeout(this.state.lastTimeoutId);
    }
  }

  _startFill() {
    Animated.timing(
      this.state.borderWidthAnim,
      {
        toValue: this.ringWidth / 2,
        easing: Easing.linear,
        duration: this.props.delay,
      }
    ).start();
  }

  _removeFill() {
    this.state.borderWidthAnim.stopAnimation();
    this.state.borderWidthAnim.setValue(this.initialBorderWidth);
  }

  _selected() {
    this.setState({hasFocus: false});
    this.props.onInput();
  }

  render() {

    const transparent = 'rgba(255, 255, 255, 0.0)';
    const fillColor = 'rgba(255, 255, 255, 0.8)';

    return (
      <VrButton
        style={{
          flexDirection: 'row',
          layoutOrigin: [0.5, 0.5],
          position: 'absolute',
          transform: [
            {rotateY: this.props.rotateY},
            {translateZ: this.props.translateZ},
          ],
        }}
        onClick={() => this._selected()}
        onEnter={() => {
          if (!this.props.isLoading) {
            this.setState({hasFocus: true});
            const id = setTimeout(() => {
              VrSoundEffects.play(this.props.onClickSound);
              this._selected();
            }, this.props.delay);
            this.state.lastTimeoutId = id;
            this._startFill();
          }
        }}
        onExit={() => {
          this.setState({hasFocus: false});
          clearTimeout(this.state.lastTimeoutId);
          this.state.lastTimeoutId = 0;
          this._removeFill();
        }}
        onClickSound={this.props.onClickSound}
        onEnterSound={this.props.onEnterSound}
        onExitSound={this.props.onExitSound}
        onLongClickSound={this.props.onLongClickSound}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: transparent,
            borderColor: this.state.hasFocus ? fillColor : transparent,
            borderRadius: this.props.outerWidth / 2,
            borderWidth: this.ringWidth,
            height: this.props.outerWidth,
            justifyContent: 'center',
            width: this.props.outerWidth,
          }}
        >
          {!this.props.isLoading &&
            <View>
              <Animated.View
                style={{
                  backgroundColor: this.state.hasFocus ? fillColor : transparent,
                  borderColor: transparent,
                  borderRadius: this.props.outerWidth / 2,
                  borderWidth: this.state.borderWidthAnim,
                  height: this.props.outerWidth,
                  layoutOrigin: [this.layoutFactor, this.layoutFactor, 0],
                  position: 'absolute',
                  width: this.props.outerWidth,
                }}
              />
              <Image
                style={{
                  height: this.props.innerWidth,
                  width: this.props.innerWidth,
                }}
                source={this.props.source}
              />
            </View>
          }
          {this.props.isLoading &&
            <LoadingSpinner />
          }
        </View>
        { this.state.hasFocus &&
          <Text
            style={{
              backgroundColor: 'black',
              color: 'white',
              fontSize: this.props.height * 0.7,
              height: this.props.height,
              marginLeft: 0.05,
              marginTop: (this.props.outerWidth - this.props.innerWidth) / 2,
              padding: 0.1,
              left: this.props.outerWidth + 0.05,
              textAlign: 'center',
              textAlignVertical: 'auto',
          }}>
            {this.props.textLabel}
          </Text>
        }
      </VrButton>
    );
  }
}

module.exports = NavButton;
