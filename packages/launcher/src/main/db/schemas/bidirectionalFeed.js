// @flow

import ethAddress from './ethAddress'
import ownFeed from './ownFeed'

export default {
  title: 'bidirectional Swarm feed',
  version: 0,
  encrypted: true,
  type: 'object',
  properties: {
    readAddress: ethAddress,
    writeFeed: ownFeed,
  },
}
