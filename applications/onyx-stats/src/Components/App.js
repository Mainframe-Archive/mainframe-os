// @flow

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native-web'
import MainframeSDK from '@mainframe/sdk'

import Logo from '../../assets/images/mainframe-logo.svg'
import StakingGraph from './StakingGraph'
import StakingTimeline from './StakingTimeline'
import Text from './ui-kit/Text'
import colors from './ui-kit/Colors'

type State = {
  stakingData?: Array<Object>,
  requestErr?: string,
  readValue?: string,
}

export default class App extends Component<null, State> {
  sdk: MainframeSDK

  constructor() {
    super()
    this.sdk = new MainframeSDK()
    this.state = {}
  }

  componentDidMount() {
    this.readFromDatabase()
  }

  async readFromDatabase() {
    const value = await this.sdk.db.readByUUID('hellomainframe', 'name')
    this.setState({readValue: value})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Logo />
              <Text style={styles.title}>Bluzelle Test</Text>
              <Text style={styles.descriptionLabel}>
                Read from decentralized keystore database: {this.state.readValue}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    backgroundColor: colors.darkBlueColor,
  },
  header: {
    marginTop: 25,
    width: '100%',
    backgroundColor: colors.darkBlueColor,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.darkBlueColor,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 15,
    color: colors.whiteColor,
  },
  mfLogo: {
    width: 100,
    height: 20,
  },
  scrollView: {
    flex: 1,
    width: 600,
  },
  descriptionLabel: {
    color: colors.lightGreyBlue,
    fontSize: 14,
  },
  loadingContainer: {
    paddingTop: 100,
  },
  errorContainer: {
    marginTop: 60,
    padding: 30,
    textAlign: 'center',
    backgroundColor: colors.extraDarkBlue,
  },
  errorLabel: {
    color: colors.redColor,
  },
})
