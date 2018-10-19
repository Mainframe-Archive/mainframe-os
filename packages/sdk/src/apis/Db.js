// @flow

import ClientAPIs from '../ClientAPIs'

export default class DbAPIs extends ClientAPIs {
  readByUUID(uuid: string, key: string): Promise<string> {
    return this._rpc.request('db_read', {uuid, key})
  }
  
  writeByUUID(uuid: string, key: string, value: string): Promise<null> {
    return this._rpc.request('db_write', {uuid, key, value})
  }
  
  // TODO: make local-name mapping of tables to UUIDs
  read(table: string, key: string): Promise<string> {
    throw new Error('Not implemented')
  }
  
  write(table: string, key: string, value: string): Promise<null> {
    throw new Error('Not implemented')
  }
}
