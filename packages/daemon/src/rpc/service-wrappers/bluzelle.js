import bluzelle from 'bluzelle'

export default class BluzelleAPI {
  websocketUrl: string

  constructor(websocketUrl) {
    this.websocketUrl = websocketUrl
  }
  create(uuid, key, value) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.create(key, value)
  }

  read(uuid, key) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.read(key)
  }

  update(uuid, key, value) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.update(key, value)
  }

  remove(uuid, key) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.remove(key)
  }

  has(uuid, key) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.has(key)
  }

  keys(uuid) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.keys()
  }

  size(uuid) {
    bluzelle.connect(this.websocketUrl, uuid)
    return bluzelle.size()
  }
}
