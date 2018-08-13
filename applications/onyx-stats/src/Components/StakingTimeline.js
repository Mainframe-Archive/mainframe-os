// @flow

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'

import Text from './ui-kit/Text'
import colors from './ui-kit/Colors'
type Props = {
  stakingData: Array<Object>,
}

export default class StakingTimeline extends Component<Props> {
  render() {
    const rows = this.props.stakingData.reduce((res, obj) => {
      const eventsInRange = obj.events.map(e => {
        if (e.event === 'Staked') {
          return (
            <View style={styles.row} key={e.id}>
              <View style={styles.rowSection}>
                <Text style={styles.nodeLabel}>Node: </Text>
                <Text style={styles.nodeAddr}>
                  {e.returnValues.whitelistAddress}
                </Text>
              </View>
              <View style={styles.rowSection}>
                <Text style={styles.walletLabel}>1 MFT staked by: </Text>
                <Text style={styles.walletAddr}>{e.returnValues.owner}</Text>
              </View>
            </View>
          )
        }
        return null
      })
      res.push(
        <View style={styles.listSectionHeader}>
          <Text style={styles.sectionHeaderLabel}>{obj.name}</Text>
          <View style={styles.timelineDot} />
        </View>,
      )
      res.push(eventsInRange)
      return res
    }, [])
    return <View style={styles.listContainer}>{rows}</View>
  }
}

const styles = StyleSheet.create({
  listContainer: {
    borderLeftWidth: 3,
    borderLeftColor: colors.extraDarkBlue,
  },
  listSectionHeader: {
    flexDirection: 'row',
    marginTop: 25,
    width: 85,
    backgroundColor: colors.extraDarkBlue,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  sectionHeaderLabel: {
    color: colors.lightGreyBlue,
    fontSize: 12,
    padding: 8,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.redColor,
  },
  row: {
    paddingHorizontal: 30,
    marginLeft: 30,
    marginTop: 25,
    padding: 10,
    borderRadius: 40,
    backgroundColor: colors.darkGreyBlueColor,
  },
  rowSection: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  walletLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.lightGreyBlue,
  },
  walletAddr: {
    fontSize: 11,
    color: colors.lightGreyBlue,
  },
  nodeLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.whiteColor,
  },
  nodeAddr: {
    fontSize: 14,
    color: colors.whiteColor,
  },
})
