import bluzelle from 'bluzelle'

export default class BluzelleAPI {
  websocketUrl: string
  
  constructor(websocketUrl) {
    this.websocketUrl = websocketUrl
  }
  create(table, key, value) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.create(key, value)
  }

  read(table, key) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.read(key)
  }

  update(table, key, value) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.update(key, value)
  }

  remove(table, key) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.remove(key)
  }

  has(table, key) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.has(key)
  }

  keys(table) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.keys()
  }

  size(table) {
    bluzelle.connect(this.websocketUrl, table)
    return bluzelle.size()
  }
}
