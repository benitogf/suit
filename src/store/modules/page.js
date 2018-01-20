// @flow
import Vue from 'vue'
import VueResource from 'vue-resource'
import * as types from '../mutation-types'

Vue.use(VueResource)

// initial state
const state = {
  pages: {}
}

// getters
const getters = {}

// actions
const actions = {
  setPage ({ commit }, { tag, page }) {
    commit(types.SET_PAGES, { tag, page })
  },
  getPage ({ commit, state }, tag) {
    let page
    if (!state.pages[tag]) {
      page = {}
      commit(types.SET_PAGES, { tag, page })
    } else {
      page = state.pages[tag]
    }
    return page
  }
}

// mutations
const mutations = {
  [types.SET_PAGES] (state, { tag, page }) {
    state.pages[tag] = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
