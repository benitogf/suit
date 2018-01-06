import shop from '../../../api/shop'
import * as types from '../mutation-types'

// initial state
const state = {
  all: null,
  currentProduct: null
}

// getters
const getters = {
  allProducts: state => state.all,
  currentProduct: state => state.currentProduct
}

// actions
const actions = {
  getAllProducts ({ commit, state }) {
    if (!Array.isArray(state.all)) {
      shop.getProducts(products => {
        commit(types.CLEAR_BAG)
        commit(types.RECEIVE_PRODUCTS, { products })
      })
    }
  },
  getProduct ({ commit, state }, id) {
    if (!Array.isArray(state.all)) {
      shop.getProducts(products => {
        commit(types.CLEAR_BAG)
        commit(types.RECEIVE_PRODUCTS, { products })
        commit(types.RECEIVE_PRODUCT, { id })
      })
    } else {
      commit(types.RECEIVE_PRODUCT, { id })
    }
  }
}

// mutations
const mutations = {
  [types.RECEIVE_PRODUCTS] (state, { products }) {
    state.all = products
  },

  [types.RECEIVE_PRODUCT] (state, { id }) {
    state.currentProduct = state.all.find(p => p.id === id)
  },

  [types.ADD_TO_BAG] (state, { id }) {
    state.all.find(p => p.id === id).inventory--
  },

  [types.REMOVE_FROM_BAG] (state, { id }) {
    state.all.find(p => p.id === id).inventory++
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
