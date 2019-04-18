// @flow

export default {
  title: 'own Swarm feed',
  version: 0,
  encrypted: true,
  type: 'object',
  properties: {
    ethPrivKey: {
      type: 'string', // hex
      final: true,
    },
    topic: {
      type: 'string',
      final: true,
    },
    feedHash: {
      type: 'string',
    },
  },
}
