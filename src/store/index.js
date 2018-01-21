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

const filteredMutations = ['CLEAR_BAG', 'SELECT_PRODUCT', 'SELECT_PAGE']

const persistEmitter = () => {
  return store => {
    store.subscribe(mutation => {
      // console.log('MUT', mutation.type)
      if (mutation.type === 'RESTORE_MUTATION') {
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
      try {
        const state = await wh.state.get(key + ':state')
        // console.log('state:get', state)
        return state
      } catch (e) {}

      return {}
    },
    setItem: async (key, value) => {
      await wh.hub.upsert('public', 'public')
      // console.log('state:set', value)
      return await wh.state.set(key + ':state', value)
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
