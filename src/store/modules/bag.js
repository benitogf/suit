import shop from '../../../api/shop'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
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
      commit(types.ADD_TO_BAG, {
        id: product.id,
        variant: product.variant,
        bulk: product.bulk,
        price: product.price,
        quantity: product.quantity
      })
    }
  },
  removeFromBag ({ commit }, product) {
    commit(types.REMOVE_FROM_BAG, {
      id: product.id,
      variant: product.variant,
      bulk: product.bulk,
      price: product.price,
      quantity: product.quantity
    })
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
    state.lastCheckout = null
    const record = state.added.find(p => p.id === id && p.variant === variant && p.bulk === bulk)
    if (!record) {
      state.added.push({
        id,
        variant,
        bulk,
        price,
        bulkQuantity: quantity,
        quantity
      })
    } else {
      record.quantity += quantity
    }
  },

  [types.REMOVE_FROM_BAG] (state, { id, variant, bulk, price, quantity }) {
    state.lastCheckout = null
    const record = state.added.findIndex(p => p.id === id && p.variant === variant && p.bulk === bulk)
    if (state.added[record].bulkQuantity === quantity) {
      state.added.splice(record, 1)
    } else {
      state.added[record].quantity -= state.added[record].bulkQuantity
    }
  },

  [types.CLEAR_BAG] (state) {
    // clear bag
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_REQUEST] (state) {
    // clear bag
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
