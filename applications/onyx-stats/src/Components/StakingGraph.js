// @flow

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native-web'
import { AreaChart, XAxis, Area, Tooltip } from 'recharts'

import Text from './ui-kit/Text'
import colors from './ui-kit/Colors'
type Props = {
  graphData: Array<Object>,
}

export default class StakingGraph extends Component<Props> {
  renderTooltip = (item: Object) => {
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

  render() {
    return (
      <AreaChart
        width={600}
        height={220}
        data={this.props.graphData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={colors.lightBlueColor}
              stopOpacity={0.75}
            />
            <stop
              offset="95%"
              stopColor={colors.lightBlueColor}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Tooltip
          cursor={{ stroke: colors.redColor, strokeWidth: 1 }}
          content={this.renderTooltip}
        />
        <XAxis
          dataKey="name"
          strokeWidth={0}
          tick={{
            fontFamily: 'sans-serif',
            fontSize: 12,
            fill: colors.medGreyBlueColor,
          }}
        />
        <Area
          type="monotone"
          dataKey="transactions"
          stroke={colors.lightBlueColor}
          fill="url(#colorUv)"
          activeDot={{
            stroke: colors.redColor,
            strokeWidth: 2,
            fill: colors.whiteColor,
          }}
          dot={{
            stroke: colors.lightBlueColor,
            strokeWidth: 1,
            fill: colors.whiteColor,
          }}
        />
      </AreaChart>
    )
  }
}

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: colors.whiteColor,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  tooltipText: {
    color: colors.darkGreyBlueColor,
    fontSize: 11,
  },
})
