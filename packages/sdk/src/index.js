// @flow

class SDK {
  constructor() {
    if (window.sandboxIpc) {
      this._ipc = window.sandboxIpc
    } else {
      throw new Error('Cannot find expected ipc instance')
    }
  }

  makeRequest = request => {
    return this._ipc.callMain('ipcRequest', request)
  }
}

class Web3 extends SDK {
  getContractEvents = (
    contractAddr: string,
    abi: Array<any>,
    eventName: string,
    options: Object,
  ): Promise<Array<Object>> => {
    return this.makeRequest({
      method: 'web3.getContractEvents',
      args: [contractAddr, abi, eventName, options],
    })
  }

  getLatestBlock = (): Promise<number> => {
    return this.makeRequest({
      method: 'web3.getLatestBlock',
    })
  }
}

export default class MainframeSDK extends SDK {
  constructor() {
    super()
    this.web3 = new Web3()
  }

  apiVersion = () => {
    return this.makeRequest({
      method: 'apiVersion',
      args: [],
    })
  }
}
