//@flow

import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native-web'

import Text from '../UIComponents/Text'
import colors from '../colors'
import bgGraphic from '../../assets/images/onboard-background.png'

type Props = {
  children: any,
  title: string,
  description?: string,
}

export default class OnboardContainerView extends Component<Props> {
  render() {
    const description = this.props.description ? (
      <Text style={styles.description}>{this.props.description}</Text>
    ) : null
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>{this.props.title}</Text>
            {description}
            {this.props.children}
          </View>
        </View>
        <View style={styles.bgGraphicContainer}>
          <Image
            style={styles.bgImage}
            source={bgGraphic}
            resizeMode="contain"
          />
        </View>
      </View>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    maxWidth: 400,
    marginLeft: 100,
  },
  bgGraphicContainer: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: 348,
    height: 575,
  },
  bgImage: {
    flex: 1,
    textAlign: 'right',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 34,
    paddingBottom: PADDING,
    color: colors.PRIMARY_BLUE,
  },
  description: {
    fontSize: 14,
    paddingBottom: PADDING * 2,
  },
})
