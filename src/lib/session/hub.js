// @flow
import { Item } from '@/lib/session/item'
import { session } from '@/lib/session/session'

const hub = {
  async set (hub) {
    let pack = await this.session.pack(hub, 'public')
    return await this.set(['hub', hub.id], pack)
  },

  async getAll () {
    let keys = ['hub']
    let hubs = await this.getAll(keys)
    var result = []
    for (let hub of hubs) {
      let data = await this.session.unpack(hub.data, 'public')
      result.push(data)
    }
    return result
  },

  async select (key, keyword) {
    await this.session.setKeyword(keyword, key)
    return this.item.getAll()
  },

  async create (key, keyword) {
    var now = Date.now() / 1000
    var hub = {
      id: key,
      created: now,
      updated: now
    }
    var keys = ['hub', key]
    await this.free(keys)
    await this.hub.set(hub)
    await this.session.setKeyword(keyword, key)
    return hub
  },

  async update (key, newKey, newKeyword) {
    const selectedHub = await this.session.get()
    if (selectedHub && selectedHub.id === key) {
      await this.free(['hub', newKey])
      await this.exist(['hub', key])
      let data = await this.get(['hub', key])
      let items = await this.item.getAll()
      await this.delAll(['item', key])
      await this.del(['hub', key])
      let hub = await this.session.unpack(data, 'public')
      hub.id = newKey
      hub.updated = Date.now() / 1000
      await this.hub.set(hub)
      var keyword = newKeyword || selectedHub.keyword
      await this.session.setKeyword(keyword, newKey)
      await this.item.setMany(items)
      this.session.clearKeyword()
      return newKey
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('UPDATE_HUB_NOT_SELECTED'))
      })
    }
  },

  async upsert (key, keyword) {
    try {
      await this.exist(['hub', key])
      await this.hub.select(key, keyword)
    } catch (e) {
      return await this.hub.create(key, keyword)
    }
  },

  async delete (id) {
    const hub = await this.session.getHub()
    if (hub === id) {
      await this.delAll(['item', hub])
      await this.del(['hub', id])
      let hubs = await this.hub.getAll()
      this.session.clearKeyword()
      return hubs
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('DELETE_HUB_NOT_SELECTED'))
      })
    }
  }
}

class Hub extends Item {
  constructor (opt) {
    super(opt)
    this.hub = {}
    this.session = session
    Object.keys(hub).forEach((method) => {
      this.hub[method] = hub[method].bind(this)
    })
  }
}

export { Hub }
