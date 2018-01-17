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
  addProduct ({ commit }, baseProduct) {
    commit(types.ADD_PRODUCT, { baseProduct })
  },
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
  },
  removeExtra ({ commit }, { id, label, extra }) {
    commit(types.CLEAR_BAG)
    commit(types.REMOVE_EXTRA, { id, label, extra })
  },
  removeProduct ({ commit }, id) {
    commit(types.CLEAR_BAG)
    commit(types.REMOVE_PRODUCT, { id })
  }
}

// mutations
const mutations = {
  [types.ADD_TO_BAG] (state, { id }) {
    state.all.find(product => product.id === id).inventory--
  },

  [types.ADD_PRODUCT] (state, { baseProduct }) {
    const newId = state.all.length + 1
    baseProduct.id = newId
    baseProduct.name = baseProduct.name + '(' + newId + ')'
    state.all.push(baseProduct)
  },

  [types.REMOVE_PRODUCT] (state, { id }) {
    state.all = state.all.filter(product => product.id !== parseInt(id))
  },

  [types.REMOVE_EXTRA] (state, { id, label, extra }) {
    let product = state.all.find(product => product.id === id)
    product[label + 's'] = product[label + 's'].filter(x => extra.label !== x.label)
    if (product[label] === label) {
      product[label] = null
    }
  },

  [types.RECEIVE_PRODUCTS] (state, { products }) {
    state.all = products
  },

  [types.RECEIVE_PRODUCT] (state, { id }) {
    state.currentProduct = state.all.find(product => product.id === id)
  },

  [types.REMOVE_FROM_BAG] (state, { id }) {
    state.all.find(product => product.id === id).inventory++
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
