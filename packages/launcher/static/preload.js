const electronRPC = require('@mainframe/rpc-electron').default

window.mainframe = {
  rpc: electronRPC('rpc-sandboxed'),
}
