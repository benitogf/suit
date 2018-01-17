// @flow
import { Portal } from '@/lib/session/portal'

const item = {
  async set (item) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      if (!item.id) {
        item.id = await this.session.hash(item.label)
      }
      let data = await this.session.pack(item, selectedHub.keyword)
      console.log(item.id, data.length)
      // TODO: prevent leaving the page while a db operation is in progress
      return this.set(['item', selectedHub.id, item.id], data)
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('SET_ITEM_NOT_SELECTED'))
      })
    }
  },

  async setMany (items) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      var newItems = await this.item.pack(items, selectedHub)
      return this.setMany(newItems)
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('SET_ITEMS_NOT_SELECTED'))
      })
    }
  },

  async create (item) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      var now = Date.now() / 1000
      if (!item.label) {
        item.label = await this.session.hash(item.data)
      }
      if (!item.id) {
        item.id = await this.session.hash(item.label)
      }
      item.created = now
      item.updated = now
      var keys = ['item', selectedHub.id, item.id]
      await this.free(keys)
      return this.item.set(item)
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('CREATE_ITEM_NOT_SELECTED'))
      })
    }
  },

  async update (item) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      var oldKeys = ['item', selectedHub.id, item.id]
      if (!item.label) {
        item.label = await this.session.hash(item.data)
      }
      item.id = await this.session.hash(item.label)
      var keys = ['item', selectedHub.id, item.id]
      try {
        await this.exist(oldKeys)
        await this.free(keys)
        await this.del(oldKeys)
        var now = Date.now() / 1000
        item.id = await this.session.hash(item.label)
        item.updated = now
        return this.item.set(item)
      } catch (e) {
        throw e
      }
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('UPDATE_ITEM_NOT_SELECTED'))
      })
    }
  },

  async upsert (item) {
    let hub = await this.session.getHub()
    try {
      await this.free(['item', hub, item.id])
      return this.item.create(item)
    } catch (e) {
      return this.item.update(item)
    }
  },

  async delSome (ids) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      var toDel = []
      ids.forEach(function (id) {
        toDel.push('item:' + selectedHub.id + ':' + id)
      })
      return this.delSome(toDel)
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('DELETE_ITEMS_NOT_SELECTED'))
      })
    }
  },

  async get (id) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      try {
        // let id = await this.session.hash(label)
        let keys = ['item', selectedHub.id, id]
        let data = await this.get(keys)
        var dec = await this.session.unpack(data, selectedHub.keyword)
        return dec
      } catch (e) {
        throw e
      }
    } else {
      throw new Error('GET_ITEM_NOT_SELECTED')
    }
  },

  async getAll (filter) {
    const selectedHub = await this.session.get()
    if (selectedHub) {
      let keys = ['item', selectedHub.id]
      if (filter) {
        keys.concat(filter)
      }
      let items = await this.getAll(keys)
      try {
        return this.item.unpack(items, selectedHub)
      } catch (e) {
        this.session.clearKeyword()
        return new Error('ITEMS_READ_FAIL')
      }
    } else {
      return new Error('GET_ITEMS_NOT_SELECTED')
    }
  },

  async pack (items, hub) {
    var result = []
    for (let item of items) {
      let data = await this.session.pack(item, hub.keyword)
      let id = ['item', hub.id, item.id].join(':')
      result.push({ id, data })
    }
    return result
  },

  async unpack (items, hub) {
    var result = []
    for (let item of items) {
      let unpack = await this.session.unpack(item.data, hub.keyword)
      if (unpack && result) {
        result.push(unpack)
      } else {
        result = false
      }
    }
    return result
  }
}

class Item extends Portal {
  constructor (opt) {
    super(opt)
    this.item = {}
    Object.keys(item).forEach((method) => {
      this.item[method] = item[method].bind(this)
    })
  }
}

export { Item }
