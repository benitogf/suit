// @flow
import { Delta } from '@/lib/session/delta'

const state = {
  async set (label, data) {
    let index = 0
    let images = []
    if (Array.isArray(data.products.all)) {
      for (let dt of data.products.all) {
        let img = dt.picture
        if (img && img.indexOf('data:image') === 0) {
          let id = await this.session.hash('picture:' + img)
          try {
            images.push(id)
            await this.item.create({ id, data: img })
          } catch (e) {
          }
          data.products.all[index].picture = id
        }
        index++
      }
    }

    if (data.page.pages && Object.keys(data.page.pages).length) {
      for (let page of Object.keys(data.page.pages)) {
        if (data.page.pages[page]) {
          for (let section of Object.keys(data.page.pages[page])) {
            if (data.page.pages[page][section]) {
              for (let sub of data.page.pages[page][section]) {
                if (Array.isArray(sub.data)) {
                  for (let delta of sub.data) {
                    if (Array.isArray(delta.ops)) {
                      for (let op of delta.ops) {
                        let img = op.insert.image
                        if (img && img.indexOf('data:image') === 0) {
                          let id = await this.session.hash('picture:' + img)
                          try {
                            await this.item.create({ id, data: img })
                          } catch (e) {
                          }
                          op.insert.image = id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    await this.item.set({ label, data })
    return data
  },

  async get (label) {
    try {
      let id = await this.session.hash(label)
      let content = await this.item.get(id)
      let index = 0
      if (Array.isArray(content.data.products.all)) {
        for (let dt of content.data.products.all) {
          let img = dt.picture
          if (img && img.indexOf('data:image') === -1) {
            let id = img
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
      }

      if (content.data.page.pages && Object.keys(content.data.page.pages).length) {
        for (let page of Object.keys(content.data.page.pages)) {
          if (content.data.page.pages[page]) {
            for (let section of Object.keys(content.data.page.pages[page])) {
              if (content.data.page.pages[page][section]) {
                for (let sub of content.data.page.pages[page][section]) {
                  if (Array.isArray(sub.data)) {
                    for (let delta of sub.data) {
                      if (Array.isArray(delta.ops)) {
                        for (let op of delta.ops) {
                          let img = op.insert.image
                          if (img && img.indexOf('data:image') === -1) {
                            let id = img
                            let image
                            try {
                              image = await this.item.get(id)
                            } catch (e) {
                              image = { data: '' }
                            }
                            op.insert.image = image.data
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return content.data
    } catch (e) {
      return {}
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
