// @flow

import ownFeed from './ownFeed'

export default {
  title: 'bidirectional Swarm feed',
  version: 0,
  encrypted: true,
  type: 'object',
  properties: {
    localFeed: ownFeed,
    localFeedData: {
      type: 'string', // JSON-stringified object
    },
    remoteFeed: {
      type: 'string', // Swarm hash
    },
  },
}
