import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as actions from './actions'
import * as getters from './getters'
import user from './modules/user'
import tag from './modules/tag'
import page from './modules/page'
import bag from './modules/bag'
import products from './modules/products'

Vue.use(Vuex)

/* eslint-disable no-new */
export default new Vuex.Store({
  plugins: [createPersistedState()],
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
