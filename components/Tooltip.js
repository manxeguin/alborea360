'use strict';

import React from 'react';
import {
  asset,
  Image,
  Text,
  Video,
  View,
} from 'react-vr';


class Tooltip extends React.Component {

  constructor(props) {
    super();
  }

  ImageTooltip(props) {

    const fontSize = {
      attrib: 0.05,
    };

    return(
      <Image
        style={{
          borderColor: '#777879',
          borderWidth: 0.01,
          height: props.tooltip.height,
          justifyContent: 'flex-end',
          width: props.tooltip.width,
        }}
        source={asset(props.tooltip.source)}
      >
      {props.tooltip.attribution && 
        <Text
          style={{
            fontSize: fontSize.attrib,
            right: 0.02,
            textAlign: 'right',
            textAlignVertical: 'bottom',
          }}
        >
          {props.tooltip.attribution}
        </Text>
      }
      </Image>
    );
  }

  VideoTooltip(props) {

    return(
      <Video
        style={{
          height: props.tooltip.height,
          width: props.tooltip.width,
        }}
        source={asset(props.tooltip.source)}
        muted={props.tooltip.muted}
      >
      </Video>
    );
  }

  PanelImageTooltip(props) {

    const fontSize = {
      attrib: 0.05,
      text: 0.1,
      title: 0.15,
    };
    const margin = 0.05;
    const titleOpacity = 0.60;

    return(
      <View
        style={{
          borderColor: '#777879',
          borderWidth: 0.01,
        }}
      >
        <Image
          style={{
            height: props.tooltip.height,
            width: props.tooltip.width,
            justifyContent: 'flex-end',
          }}
          source={asset(props.tooltip.source)}>

          {props.tooltip.title && 
            <View>
              <View
                style={{
                  backgroundColor: 'black',
                  bottom: -fontSize.title - margin,
                  height: fontSize.title + margin,
                  opacity: titleOpacity,
                  position: 'relative',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize.title,
                  flex: 1,
                  height: fontSize.title + margin,
                  marginLeft: margin,
                  marginRight: margin,
                  textAlignVertical: 'bottom',
                }}
              >
                {props.tooltip.title}
              </Text>
            </View>
          }
        </Image>

        <View
          style={{
            backgroundColor: 'black',
            paddingBottom: props.tooltip.attribution ? 0 : margin,
            paddingLeft: margin,
            paddingRight: margin,
            paddingTop: 0,
            width: props.tooltip.width,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: fontSize.text,
              textAlignVertical: 'center',
            }}
          >
            {props.tooltip.text}
          </Text>
          {props.tooltip.attribution && 
            <Text
              style={{
                fontSize: fontSize.attrib,
                right: -margin + 0.02,
                textAlign: 'right',
              }}
            >
              {props.tooltip.attribution}
            </Text>
          }
        </View>
      </View>
    );
  }

  TextblockTooltip(props) {

    const fontSize = {
      attrib: 0.05,
      text: 0.1,
      title: 0.15,
    };

    return(
      <View
        style={{
          backgroundColor: 'black',
          padding: 0.1,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: fontSize.title,
            width: props.tooltip.width,
          }}
        >
          {props.tooltip.title}
        </Text>
        {props.tooltip.title &&
          <View
            style={{
              backgroundColor: '#777879',
              height: 0.01, 
              width: props.tooltip.width,
            }}
          />
        }
        <Text
          style={{
            color: 'white',
            fontSize: fontSize.text,
            width: props.tooltip.width,
          }}
        >
          {props.tooltip.text}
        </Text>
        {props.tooltip.attribution && 
          <Text
            style={{
              fontSize: fontSize.attrib,
              right: 0.02,
              textAlign: 'right',
            }}
          >
            {props.tooltip.attribution}
          </Text>
        }
      </View>
    );
  }

  render() {

    switch(this.props.tooltip.type) {
      case 'image':
        return(<this.ImageTooltip tooltip={this.props.tooltip} />);
      case 'video':
        return(<this.VideoTooltip tooltip={this.props.tooltip} />);
      case 'panelimage':
        return(<this.PanelImageTooltip tooltip={this.props.tooltip} />);
      case 'textblock':
        return(<this.TextblockTooltip tooltip={this.props.tooltip} />);
      default:
        return(<Text style={{backgroundColor: 'red'}}>Missing Tooltip</Text>);
    }
  }

}

module.exports = Tooltip;
