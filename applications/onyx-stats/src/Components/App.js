// @flow

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native-web'
import Web3 from 'web3'
import MainframeSDK from '@mainframe/sdk'

import Logo from '../../assets/images/mainframe-logo.svg'
import StakingGraph from './StakingGraph'
import StakingTimeline from './StakingTimeline'
import Text from './ui-kit/Text'
import colors from './ui-kit/Colors'

type State = {
  stakingData?: Array<Object>,
  requestErr?: string,
}

export default class App extends Component<null, State> {
  sdk: MainframeSDK
  web3: Web3

  constructor() {
    super()
    this.sdk = new MainframeSDK()
    this.web3 = new Web3(this.sdk.blockchain.getWeb3Provider())
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
      {
        constant: true,
        inputs: [
          {
            name: '_address',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ]

    const tokenABI = [
      {
        constant: false,
        inputs: [
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_address',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ]

    try {
      const mfStakeAddr = '0xe3C2130530D77418b3e367Fe162808887526e74D'
      const mfTokenAddr = '0xA46f1563984209fe47f8236f8B01a03f03F957E4'
      const contract = new this.web3.eth.Contract(abi, mfStakeAddr)
      const tokenContract = new this.web3.eth.Contract(tokenABI, mfTokenAddr)
      const accounts = await this.web3.eth.getAccounts()
      const data = tokenContract.methods
        .transfer('0xaAf7a7155101236f4067963EFc80252F32DC00DF', 10000)
        .encodeABI()
      console.log('data: ', data)
      tokenContract.methods
        .transfer('0xaAf7a7155101236f4067963EFc80252F32DC00DF', 10000)
        .send({
          from: accounts[0],
          gasLimit: 500000,
          gasPrice: 5000000000,
        })
        .on('transactionHash', console.log)
        .on('receipt', receipt => {
          console.log('Receipt: ', receipt)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log('confirmation:', confirmationNumber)
        })
        .on('error', console.error)
      // const res1 = contract.methods
      //   .balanceOf('0xaAf7a7155101236f4067963EFc80252F32DC00DF')
      //   .call()
      // const res = contract.methods
      //   .balanceOf('0xaAf7a7155101236f4067963EFc80252F32DC00DF')
      //   .send({
      //     from: '0x9ab031781d234342f7765636ac2f557ef402fc38',
      //     gasPrice: 100000,
      //     gasLimit: 2000000,
      //   })
      console.log('waiting for result...')
      // const latestBlock = await this.sdk.blockchain.getLatestBlock()
      // const res = await this.sdk.blockchain.getContractEvents(
      //   mfTokenAddr,
      //   abi,
      //   'Staked',
      //   { fromBlock: 5916157, toBlock: latestBlock },
      // )
      // const data = this.formatData(res)
      // this.setState({
      //   stakingData: data,
      // })
    } catch (err) {
      console.log('WEB3 ERROR:', err)
      this.setState({ requestErr: err })
    }
  }

  formatData(events: Array<Object>) {
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

    const graphData: Array<Object> = Object.keys(data).map(key => {
      const value = data[key]
      return {
        name: key,
        transactions: value.length,
        events: value,
      }
    })
    return graphData
  }

  render() {
    let content
    if (this.state.requestErr) {
      content = (
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>
            Sorry, there was a problem reading from the blockchain
          </Text>
        </View>
      )
    } else {
      content = !this.state.stakingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <StakingGraph graphData={this.state.stakingData} />
          <StakingTimeline stakingData={this.state.stakingData} />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Logo />
              <Text style={styles.title}>Onyx Staking</Text>
              <Text style={styles.descriptionLabel}>
                Onyx staking transactions per 1000 blocks
              </Text>
            </View>
            {content}
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
