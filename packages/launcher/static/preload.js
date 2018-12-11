const electronRPC = require('@mainframe/rpc-electron').default
const { getWeb3Provider } = require('@mainframe/web3-provider')

const rpc = electronRPC('rpc-app-sandboxed')
const web3Provider = getWeb3Provider(rpc)

window.mainframe = { rpc }
window['web3'] = { currentProvider: web3Provider } // Existing standard
window.ethereum = web3Provider // TODO: Provider needs updating to support this new standard https://eips.ethereum.org/EIPS/eip-1102
