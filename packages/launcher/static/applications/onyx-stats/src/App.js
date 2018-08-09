// @flow

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Image } from 'react-native-web'
import MainframeSDK from '@mainframe/sdk'
import { AreaChart, XAxis, Area, Tooltip } from 'recharts'

import Text from './ui-kit/Text'

export default class App extends Component {
  constructor() {
    super()
    this.sdk = new MainframeSDK()
    this.state = {}
  }

  componentDidMount() {
    this.getEvents()
  }

  async getEvents() {
    const abi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: false,
            name: 'whitelistAddress',
            type: 'address',
          },
        ],
        name: 'Staked',
        type: 'event',
      },
    ]
    const mfTokenAddr = '0xe3C2130530D77418b3e367Fe162808887526e74D'
    const latestBlock = await this.sdk.blockchain.getLatestBlock()
    const res = await this.sdk.blockchain.getContractEvents(
      mfTokenAddr,
      abi,
      'Staked',
      { fromBlock: 5916157, toBlock: latestBlock },
    )
    this.generateGraphData(res)
    this.setState({
      stakingEvents: res,
    })
  }

  generateGraphData(events: Array<Object>) {
    if (!events || !events.length) {
      return []
    }
    let block = Math.floor(events[0].blockNumber / 10000) * 10000
    const blockRange = 10000
    const data = events.reduce((res, e) => {
      const blockLimit = block + blockRange
      if (e.blockNumber < blockLimit) {
        const rangeKey = `${block}`
        if (res[rangeKey]) {
          res[rangeKey].push(e)
        } else {
          res[rangeKey] = [e]
        }
      } else {
        block = blockLimit
        const rangeKey = `${block}`
        res[rangeKey] = [e]
      }
      return res
    }, {})

    const graphData = Object.keys(data).map(key => {
      const value = data[key]
      return {
        name: key,
        transactions: value.length,
        events: value,
      }
    })

    this.setState({
      graphData: graphData,
    })
  }

  renderTooltip = item => {
    if (item.payload.length) {
      return (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            Staked:{' '}
            <Text style={styles.boldLabel}>{item.payload[0].value}</Text>
          </Text>
        </View>
      )
    }
  }

  renderEvents() {
    if (this.state.stakingEvents) {
      const rows = Object.keys(this.state.graphData).reduce((res, key) => {
        const obj = this.state.graphData[key]
        const eventsInRange = obj.events.map(e => {
          if (e.event === 'Staked') {
            return (
              <View style={styles.row}>
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

  renderGraphData() {
    if (!this.state.graphData) {
      return
    }
    return (
      <AreaChart
        width={600}
        height={220}
        data={this.state.graphData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lightBlueColor} stopOpacity={0.75} />
            <stop offset="95%" stopColor={lightBlueColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          cursor={{ stroke: redColor, strokeWidth: 1 }}
          content={this.renderTooltip}
        />
        <XAxis
          dataKey="name"
          strokeWidth={0}
          tick={{
            fontFamily: 'sans-serif',
            fontSize: 12,
            fill: medGreyBlueColor,
          }}
        />
        <Area
          type="monotone"
          dataKey="transactions"
          stroke={lightBlueColor}
          fill="url(#colorUv)"
          activeDot={{
            stroke: redColor,
            strokeWidth: 2,
            fill: whiteColor,
          }}
          dot={{ stroke: lightBlueColor, strokeWidth: 1, fill: whiteColor }}
        />
      </AreaChart>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Image
                style={styles.mfLogo}
                source={'../assets/images/mainframe-logo.svg'}
                resizeMode="contain"
              />
              <Text style={styles.title}>Onyx Staking</Text>
              <Text>Onyx staking transactions per 1000 blocks</Text>
            </View>
            {this.renderGraphData()}
            {this.renderEvents()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const redColor = '#c8325a'
const lightBlueColor = '#00A7E7'
const darkBlueColor = '#131f38'
const extraDarkBlue = '#0e1728'
const darkGreyBlueColor = '#1d2b47'
const medGreyBlueColor = '#57647f'

const lightGreyBlue = '#b3bbcc'
const whiteColor = '#ffffff'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    backgroundColor: darkBlueColor,
  },
  header: {
    marginTop: 25,
    width: '100%',
    backgroundColor: darkBlueColor,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: darkBlueColor,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 15,
    color: whiteColor,
  },
  mfLogo: {
    width: 100,
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    borderLeftWidth: 3,
    borderLeftColor: extraDarkBlue,
  },
  listSectionHeader: {
    flexDirection: 'row',
    marginTop: 25,
    width: 85,
    backgroundColor: extraDarkBlue,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  sectionHeaderLabel: {
    color: lightGreyBlue,
    fontSize: 12,
    padding: 8,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: redColor,
  },
  row: {
    paddingHorizontal: 30,
    marginLeft: 30,
    marginTop: 25,
    padding: 10,
    borderRadius: 40,
    backgroundColor: darkGreyBlueColor,
  },
  rowSection: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  walletLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: lightGreyBlue,
  },
  walletAddr: {
    fontSize: 11,
    color: lightGreyBlue,
  },
  nodeLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: whiteColor,
  },
  nodeAddr: {
    fontSize: 14,
    color: whiteColor,
  },
  tooltip: {
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  tooltipText: {
    color: darkGreyBlueColor,
    fontSize: 11,
  },
})
