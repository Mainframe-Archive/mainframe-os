// @flow

// Needed to fix issue with Ledger: https://github.com/LedgerHQ/ledgerjs/issues/211
import '@babel/polyfill'

export {
  isListening as isServerListening,
  start as startServer,
  stop as stopServer,
} from './rpc'
