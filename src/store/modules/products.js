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
  addExtra ({ commit }, { id, label, extra }) {
    commit(types.ADD_EXTRA, { id, label, extra })
  },
  alterProduct ({ commit }, product) {
    commit(types.ALTER_PRODUCT, { product })
  },
  alterExtra ({ commit }, { id, label, extra }) {
    commit(types.ALTER_EXTRA, { id, label, extra })
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
  getProducts ({ commit, state }) {
    if (!Array.isArray(state.all)) {
      shop.getProducts(products => {
        commit(types.CLEAR_BAG)
        commit(types.RECEIVE_PRODUCTS, { products })
      })
    }
  },
  removeProduct ({ commit }, id) {
    commit(types.CLEAR_BAG)
    commit(types.REMOVE_PRODUCT, { id })
  },
  removeExtra ({ commit }, { id, label, extra }) {
    commit(types.CLEAR_BAG)
    commit(types.REMOVE_EXTRA, { id, label, extra })
  }
}

// mutations
const mutations = {
  [types.ADD_TO_BAG] (state, { id, quantity }) {
    let index = state.all.findIndex(product => product.id === id)
    if (state.all[index].inventory >= quantity) {
      state.all[index].inventory -= quantity
    }
  },

  [types.ALTER_PRODUCT] (state, product) {
    let index = state.all.findIndex(cp => product.id === cp.id)
    state.all[index] = product
  },

  [types.ADD_PRODUCT] (state, baseProduct) {
    const newId = findNextId(state.all)
    baseProduct.id = newId
    baseProduct.name = baseProduct.name + '(' + newId + ')'
    state.all.unshift(baseProduct)
  },

  [types.ADD_EXTRA] (state, { id, label, extra }) {
    let index = state.all.findIndex(product => product.id === id)
    if (!state.all[index][label + 's']) {
      state.all[index][label + 's'] = [extra]
      state.all[index][label] = extra.label
    } else {
      state.all[index][label + 's'].push(extra)
    }
  },

  [types.ALTER_EXTRA] (state, { id, label, extra }) {
    let productIndex = state.all.findIndex(product => product.id === id)
    let extraIndex = state.all[productIndex][label + 's'].findIndex(ex => ex.label === extra.label)
    Object.assign(state.all[productIndex][label + 's'][extraIndex], extra)
  },

  [types.REMOVE_PRODUCT] (state, { id }) {
    let index = state.all.findIndex(product => product.id === id)
    state.all.splice(index, 1)
  },

  [types.REMOVE_EXTRA] (state, { id, label, extra }) {
    let index = state.all.findIndex(product => product.id === id)
    state.all[index][label + 's'] = state.all[index][label + 's'].filter(x => extra.label !== x.label)
    if (state.all[index][label] === label) {
      state.all[index][label] = null
    }
  },

  [types.RECEIVE_PRODUCTS] (state, { products }) {
    state.all = products
  },

  [types.SELECT_PRODUCT] (state, { id }) {
    state.selected = id
  },

  [types.REMOVE_FROM_BAG] (state, { id, quantity }) {
    let index = state.all.findIndex(product => product.id === id)
    if (state.all[index].inventory > 0) {
      state.all[index].inventory += quantity
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
