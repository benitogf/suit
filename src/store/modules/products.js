import shop from '../../../api/shop'
import * as types from '../mutation-types'

const findNextId = products => {
  let nextId = 0
  while (products.find(product => product.id === nextId)) {
    nextId++
  }

  return nextId
}

// initial state
const state = {
  all: null,
  selected: null
}

// getters
const getters = {
  products: state => state.all,
  product: state => Array.isArray(state.all) ? state.all.find(product => product.id === state.selected) : null
}

// actions
const actions = {
  addProduct ({ commit }, baseProduct) {
    commit(types.ADD_PRODUCT, { ...baseProduct })
  },
  getProducts ({ commit, state }) {
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
        commit(types.SELECT_PRODUCT, { id })
      })
    } else {
      commit(types.SELECT_PRODUCT, { id })
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
  [types.ADD_TO_BAG] (state, { id, quantity }) {
    state.all.find(product => product.id === id).inventory -= quantity
  },

  [types.ADD_PRODUCT] (state, baseProduct) {
    const newId = findNextId(state.all)
    baseProduct.id = newId
    baseProduct.name = baseProduct.name + '(' + newId + ')'
    state.all.unshift(baseProduct)
  },

  [types.REMOVE_PRODUCT] (state, { id }) {
    let product = state.all.findIndex(product => product.id === id)
    state.all.splice(product, 1)
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

  [types.SELECT_PRODUCT] (state, { id }) {
    state.selected = id
  },

  [types.REMOVE_FROM_BAG] (state, { id, quantity }) {
    state.all.find(product => product.id === id).inventory += quantity
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
