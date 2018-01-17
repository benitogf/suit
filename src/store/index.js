import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import * as actions from './actions'
import * as getters from './getters'
import user from './modules/user'
import tag from './modules/tag'
import page from './modules/page'
import bag from './modules/bag'
import products from './modules/products'
import wh from '@/lib/session'

Vue.use(Vuex)

const filteredMutations = ['CLEAR_BAG', 'SELECT_PRODUCT', 'route/ROUTE_CHANGED']

const persistEmitter = () => {
  return store => {
    store._vm.$root.$data['vue-persist-patch-delay'] = true
    store.subscribe(mutation => {
      if (mutation.type === 'RESTORE_MUTATION') {
        store._vm.$root.$data['vue-persist-patch-delay'] = false
        store._vm.$root.$emit('storageReady')
      }
    })
  }
}

const persist = new VuexPersist({
  strictMode: true,
  asyncStorage: true,
  storage: {
    getItem: async key => {
      await wh.hub.upsert('public', 'public')
      const id = await wh.session.hash(key)
      try {
        const state = await wh.item.get(id)
        return state
      } catch (e) {}

      return {}
    },
    setItem: async (key, value) => {
      await wh.hub.upsert('public', 'public')
      return wh.item.set({ label: key, data: value })
    },
    removeItem: key => {
      return wh.item.delSome([key])
    },
    _config: {
      name: 'localforage'
    }
  },
  filter: mutation => filteredMutations.indexOf(mutation.type) === -1
})

/* eslint-disable no-new */
export default new Vuex.Store({
  mutations: {
    RESTORE_MUTATION: persist.RESTORE_MUTATION
  },
  plugins: [
    persist.plugin,
    persistEmitter()
  ],
  actions,
  getters,
  modules: {
    user,
    tag,
    page,
    products,
    bag
  }
})
