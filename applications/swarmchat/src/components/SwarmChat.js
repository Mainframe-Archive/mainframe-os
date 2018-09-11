// @flow

import React, { Component } from 'react'

import SwarmChat from '../lib/SwarmChat'

import App from './App'
import Loader from './Loader'

type Step = 'ready' | 'setup' | 'setup_failed'

type State = {
  client: ?SwarmChat,
  errorMessage: ?string,
  step: Step,
}

const DEFAULT_STATE: State = {
  client: undefined,
  errorMessage: undefined,
  step: 'setup',
}

export default class SwarmChatApp extends Component<{}, State> {
  state = DEFAULT_STATE

  async createClient(): Promise<boolean> {
    try {
      const client = new SwarmChat()
      console.log('client', client)
      await client.getOwnInfo()
      this.setState({ step: 'ready', client })
      return true
    } catch (err) {
      console.log('error', err)
      this.setState({ step: 'setup_failed', errorMessage: err.message })
      return false
    }
  }

  async setup() {
    await this.createClient()
  }

  componentDidMount() {
    this.setup()
  }

  render() {
    const { client, step } = this.state
    return step === 'ready' && client != null ? (
      <App client={client} />
    ) : (
      <Loader />
    )
  }
}
