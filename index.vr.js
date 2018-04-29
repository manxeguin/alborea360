import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  Model,
  Animated
} from 'react-vr';
import * as firebase from 'firebase'

import InfoButton from './components/InfoButton';
import NavButton from './components/NavButton';
import LoadingSpinner from './components/LoadingSpinner';

const config = {
  apiKey: "AIzaSyB22qYYZryQTPRT7iTDg-XLTZ4yWQ2meXM",
  authDomain: "alborea-7ecf0.firebaseapp.com",
  databaseURL: "https://alborea-7ecf0.firebaseio.com",
  projectId: "alborea-7ecf0",
  storageBucket: "",
  messagingSenderId: "1001756488203",
  firebaseTour: true
};

export default class alborea360 extends React.Component {
  
  static defaultProps = {
    tourSource: 'alborea.json',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      locationId: null,
      nextLocationId: null,
      rotation: null,
    };

    this.translateZ = -3;
  }

  componentDidMount() {
    this.init(config);
  }

  init(config) {
    let tourPromise;
    if (config.firebaseTour) {
      firebase.initializeApp(config);
      tourPromise = firebase.database().ref().once('value').then(function(snapshot) {
        return snapshot.val()
      });
    } else {
      tourPromise = fetch(asset(this.props.tourSource).uri)
      .then((response) => response.json());
    }
    tourPromise.then((tourConfig) => this.setState({
      data: tourConfig,
      locationId: null,
      nextLocationId: tourConfig.firstPhotoId,
      rotation: tourConfig.firstPhotoRotation +
        (tourConfig.photos[tourConfig.firstPhotoId].rotationOffset || 0),
    }))
    
  }

  getPanoAsset(url) {
    return config.firebaseTour ? {
      uri: url
    } : asset(url);
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (locationId && this.state.data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation = this.state.data.firstPhotoRotation +
      ((photoData && photoData.rotationOffset) || 0);
    const isLoading = this.state.nextLocationId !== this.state.locationId;
    const soundEffects = this.state.data.soundEffects;
    const ambient = this.state.data.soundEffects.ambient;
    // const AnimatedModel = Animated.createAnimatedComponent(Model);
    return (

      <View>
        <View style={{transform:[{rotateY: rotation}]}}>
          <Pano
            style={{
              position: 'absolute'
            }}
            onLoad={() => {
              const data = this.state.data;
              this.setState({
                locationId: this.state.nextLocationId,
              });
            }}
            source={this.getPanoAsset(this.state.data.photos[this.state.nextLocationId].uri)}
          />
          {/* <AnimatedModel
            source={{
              obj: asset('KTM.obj')
            }}
            style={{
              transform: [
                {rotateZ : 0},
                {translate: [100, -100, 300]},
                {scale : 0.12 },
              ]
            }}
            wireframe={false}
          /> */}
          {tooltips && tooltips.map((tooltip, index) => {
            if (tooltip.type) {
              return(
                <InfoButton
                  key = { index }
                  onEnterSound = { asset(soundEffects.navButton.onEnter.uri) }
                  rotateY = { tooltip.rotationY }
                  source = { asset('info_icon.png') }
                  tooltip = { tooltip }
                  translateZ = { tooltip.translateZ }
                  translateY = { tooltip.translateY }
                  translateX = { tooltip.translateX }
                />
              );
            }
            return(
              <NavButton
                key={tooltip.linkedPhotoId}
                isLoading={isLoading}
                onClickSound={asset(soundEffects.navButton.onClick.uri)}
                onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                onInput={() => {
                  this.setState({nextLocationId: tooltip.linkedPhotoId});
                }}
                rotateY={tooltip.rotationY}
                source={asset(this.state.data.nav_icon)}
                textLabel={tooltip.text}
                translateZ={tooltip.translateZ}
                translateY={tooltip.translateY}
                translateX={tooltip.translateX}
              />
            );
          })}
        </View>
        {locationId == null &&
          <View
            style={{
              transform: [{translateZ: this.translateZ}],
              layoutOrigin: [0.5, 0.5, 0],
            }}
            height={0.5}
            width={0.5}
          >
            <LoadingSpinner />
          </View>
        }
      </View>
    );
  }
};

AppRegistry.registerComponent('alborea360', () => alborea360);
