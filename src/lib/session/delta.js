// @flow
import { Hub } from '@/lib/session/hub'

const delta = {
  async set (label, data) {
    let index = 0
    let images = []
    for (let dt of data.ops) {
      let img = dt.insert.image
      if (img && img.indexOf('data:image') === 0) {
        let id = await this.session.hash(label + 'img' + img)
        try {
          images.push(id)
          await this.item.create({ id, data: img })
        } catch (e) {
        }
        data.ops[index].insert.image = id
      }
      index++
    }
    await this.item.set({ label, data }) // write
    return images
  },

  async get (label) {
    try {
      let id = await this.session.hash(label)
      let content = await this.item.get(id) // read
      let index = 0
      var images = []
      for (let dt of content.data.ops) {
        let img = dt.insert.image
        if (img && img.indexOf('data:image') === -1) {
          let id = img
          images.push(id)
          let image
          try {
            image = await this.item.get(id)
          } catch (e) {
            image = { data: '' }
          }
          content.data.ops[index].insert.image = image.data
        }
        index++
      }
      return { content, images }
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

class Delta extends Hub {
  constructor (opt) {
    super(opt)
    this.delta = {}
    Object.keys(delta).forEach((method) => {
      this.delta[method] = delta[method].bind(this)
    })
  }
}

export { Delta }
