/**
 Sets the ethereum provider, as well as "web3" for backwards compatibility.
 **/
const electronRPC = require('@mainframe/rpc-electron').default
const { getWeb3Provider } = require('@mainframe/web3-provider')
const rpc = electronRPC('rpc-app-sandboxed')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')

window.mainframe = { rpc }

const web3Provider = getWeb3Provider(rpc)
web3Provider.setMaxListeners(100)
window.ethereum = web3Provider

// Existing standard
// TODO: Provider needs updating to support this new standard https://eips.ethereum.org/EIPS/eip-1102
window.BigNumber = BigNumber;
window.web3 = {
  currentProvider: web3Provider,
}

// for now still add this too: WILL BE REMOVED when mist migrates to web3 1.0 & removes it from their preload script
window.web3 = new Web3(web3Provider)
