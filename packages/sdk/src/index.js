// @flow

/*eslint-env browser*/

type Request = {
  method: string,
  args?: Array<any>,
}

type Mainframe = {
  request: (channel: string, request: Request) => Promise<any>,
}

class SDK {
  _mainframe: Mainframe

  constructor() {
    if (window.mainframe) {
      this._mainframe = window.mainframe
    } else {
      throw new Error('Cannot find expected mainframe client instance')
    }
  }

  makeRequest = (request: Request): Promise<any> => {
    return this._mainframe.request('sdk-request', request)
  }
}

class Blockchain extends SDK {
  getContractEvents = (
    contractAddr: string,
    abi: Array<any>,
    eventName: string,
    options: Object,
  ): Promise<Array<Object>> => {
    return this.makeRequest({
      method: 'blockchain_getContractEvents',
      args: [contractAddr, abi, eventName, options],
    })
  }

  getLatestBlock = (): Promise<number> => {
    return this.makeRequest({
      method: 'blockchain_getLatestBlock',
    })
  }
}

export default class MainframeSDK extends SDK {
  blockchain: Blockchain

  constructor() {
    super()
    this.blockchain = new Blockchain()
  }

  apiVersion = () => {
    return this.makeRequest({
      method: 'apiVersion',
      args: [],
    })
  }
}
