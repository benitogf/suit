// @flow
import Vue from 'vue'
// import router from '../../router'
import VueResource from 'vue-resource'
import * as types from '../mutation-types'

Vue.use(VueResource)

// initial state
const state = {
  tags: {
    root: []
  }
}

// getters
const getters = {
  getTags: state => state.tags
}

// actions
const actions = {
  setTags ({ commit }, tags) {
    commit(types.SET_TAGS, { tags })
  }
}

// mutations
const mutations = {
  [types.SET_TAGS] (state, { tags }) {
    state.tags = tags
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
