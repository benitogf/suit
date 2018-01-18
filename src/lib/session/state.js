// @flow
import { Delta } from '@/lib/session/delta'

const state = {
  async set (label, data) {
    let index = 0
    let images = []
    // console.log('STATE:SET', data)
    for (let dt of data.products.all) {
      let img = dt.picture
      if (img && img.indexOf('data:image') === 0) {
        let id = await this.session.hash(label + ':picture:' + img)
        try {
          images.push(id)
          await this.item.create({ id, data: img })
        } catch (e) {
        }
        data.products.all[index].picture = id
      }
      index++
    }
    await this.item.set({ label, data }) // write
    return data
  },

  async get (label) {
    try {
      let id = await this.session.hash(label)
      let content = await this.item.get(id) // read
      let index = 0
      var images = []
      // console.log('STATE:GET', content)
      for (let dt of content.data.products.all) {
        let img = dt.picture
        if (img && img.indexOf('data:image') === -1) {
          let id = img
          images.push(id)
          let image
          try {
            image = await this.item.get(id)
          } catch (e) {
            image = { data: '' }
          }
          content.data.products.all[index].picture = image.data
        }
        index++
      }
      return content.data
    } catch (e) {
      return {}
    }
  },

  async update (label, images) {
    let store
    try {
      let id = await this.session.hash(label + ':images')
      store = await this.item.get(id)
    } catch (e) {
      store = { data: images }
    }
    let trash = store.data.filter((nf) => images.indexOf(nf) === -1)
    await this.item.set({
      label: label + ':images',
      data: images.concat(trash)
    })
  },

  async clean (label, images) {
    let id = await this.session.hash(label + ':images')
    let trash = []
    try {
      let store = await this.item.get(id)
      for (let img of store.data) {
        if (images.indexOf(img) === -1) {
          trash.push(img)
        }
      }
      await this.item.delSome(trash)
      await this.item.set({ id, data: images })
    } catch (e) {
      await this.item.set({ id, data: trash })
    }
  }
}

class State extends Delta {
  constructor (opt) {
    super(opt)
    this.state = {}
    Object.keys(state).forEach((method) => {
      this.state[method] = state[method].bind(this)
    })
  }
}

export { State }
