import shop from '../../../api/shop'
import * as types from '../mutation-types'

const findRecord = (state, id, variant, bulk) => state.added.findIndex(product => product.id === id && product.variant === variant && product.bulk === bulk)

const state = {
  added: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
}

// actions
const actions = {
  addToBag ({ commit }, product) {
    if (product.inventory !== 0) {
      commit(types.ADD_TO_BAG, product)
    }
  },
  removeFromBag ({ commit }, product) {
    commit(types.REMOVE_FROM_BAG, product)
  },
  checkout ({ commit, state }, products) {
    const savedBagItems = [...state.added]
    commit(types.CHECKOUT_REQUEST)
    shop.buyProducts(
      products,
      () => commit(types.CHECKOUT_SUCCESS),
      () => commit(types.CHECKOUT_FAILURE, { savedBagItems })
    )
  }
}

// mutations
const mutations = {
  [types.ADD_TO_BAG] (state, { id, variant, bulk, price, quantity }) {
    const record = findRecord(state, id, variant, bulk)
    let newq = quantity
    if (record !== -1) {
      newq = parseInt(state.added[record].quantity) + parseInt(quantity)
      state.added.splice(record, 1)
    }
    state.added.unshift({
      id,
      variant,
      bulk,
      price,
      bulkQuantity: quantity,
      quantity: newq
    })
  },

  [types.REMOVE_FROM_BAG] (state, { id, variant, bulk, price, quantity }) {
    const record = findRecord(state, id, variant, bulk)
    if (parseInt(state.added[record].bulkQuantity) === parseInt(quantity)) {
      state.added.splice(record, 1)
    } else {
      let aux = {...state.added[record]}
      aux.quantity -= parseInt(aux.bulkQuantity)
      state.added.splice(record, 1)
      state.added.unshift(aux)
    }
  },

  [types.CLEAR_BAG] (state) {
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_REQUEST] (state) {
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
    setTimeout(() => { state.checkoutStatus = null }, 3000)
  },

  [types.CHECKOUT_FAILURE] (state, { savedBagItems }) {
    // rollback to the bag saved before sending the request
    state.added = savedBagItems
    state.checkoutStatus = 'failed'
    setTimeout(() => { state.checkoutStatus = null }, 3000)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
