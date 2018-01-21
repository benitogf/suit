// @flow
import Vue from 'vue'
import api from '../../../api/tag'
import VueResource from 'vue-resource'
import * as types from '../mutation-types'

Vue.use(VueResource)

const getters = {
  tags: state => state.tags
}

// initial state
const state = {
  tags: null
}

// actions
const actions = {
  getTags ({ commit }) {
    if (!state.tags) {
      api.getTags(tags => {
        commit(types.SET_TAGS, { tags })
      })
    }
  },
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
