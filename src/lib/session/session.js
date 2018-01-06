// @flow
import jsonpack from 'jsonpack'
const globKey = '6e6a5910ea9537a7d02e44975f4765726c4a0237c7132d3ea4cf33be76ce678b'

const session = {
  que: {},
  async setKeyword (keyword, id) {
    let data = { keyword, id }
    let pack = await session.pack(data, globKey)
    window.sessionStorage.setItem('hub', pack)
    return
  },

  async getHub () {
    let pack = window.sessionStorage.getItem('hub')
    if (pack) {
      let hub = await session.unpack(pack, globKey)
      return hub.id
    } else {
      return false
    }
  },

  async get () {
    let pack = window.sessionStorage.getItem('hub')
    if (pack) {
      let hub = await session.unpack(pack, globKey)
      return hub
    } else {
      return false
    }
  },

  clearKeyword (cb) {
    window.sessionStorage.removeItem('hub')
    if (cb) {
      cb()
    }
  },

  dice (keys, data) {
    return session.execute('dice', keys, data)
  },

  undice (data) {
    return session.execute('undice', data)
  },

  pack (data, password) {
    return session.execute('pack', data, password)
  },

  unpack (data, password) {
    return session.execute('unpack', data, password)
  },

  hash (data) {
    return session.execute('hash', data)
  },

  compress (data) {
    return jsonpack.pack(data)
  },

  uncompress (data) {
    return jsonpack.unpack(data)
  },

  handle (e) {
    let aux = this.que[e.data.id]
    delete this.que[e.data.id]
    if (aux) {
      return aux(e.data.result)
    } else {
      throw new Error('tp')
    }
  },

  execute (action, data, password) {
    if (!window.sessionWorker.onmessage) {
      window.sessionWorker.onmessage = this.handle.bind(this)
    }
    let now = Date.now() + action + Math.random()
    let task = new Promise((resolve, reject) => {
      setTimeout(reject, 20000)
      this.que[now] = resolve
    })
    let msg = session.compress({
      action,
      password,
      now,
      data
    })
    window.sessionWorker.postMessage(msg)

    return task
  }
}

export { session }
