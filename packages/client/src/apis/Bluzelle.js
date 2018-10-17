import ClientAPIs from '../ClientAPIs'

export default class BluzelleAPIs extends ClientAPIs {
  write(table, name, value) {
    // TODO: handle bluzelle_write in Daemon
    return this._rpc.request('bluzelle_write', {table, name, value})
  }
}
