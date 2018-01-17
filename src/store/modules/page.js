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
  async setPage ({ commit }, { tag, page }) {
    // console.log(['page:', tag], page)
    // await wh.set(['page:', tag], page)
    commit(types.SET_PAGES, { tag, page })
  },
  async getPage ({ commit, state }, tag) {
    let page
    if (!state.page[tag]) {
      page = {}
    } else {
      page = state.page[tag]
    }
    // let page = await wh.get(['page:', tag])
    commit(types.SET_PAGES, { tag, page })
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
