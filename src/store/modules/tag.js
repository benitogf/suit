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
  delTag ({ commit }, { id, root }) {
    commit(types.DEL_TAG, { id, root })
    commit(types.DEL_PAGE, { tag: id })
  },
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
  [types.DEL_TAG] (state, { id, root }) {
    let index = state.tags[root].indexOf(id)
    state.tags[root].splice(index, 1)
    if (state.tags[root].length === 0 && root !== 'root') {
      delete state.tags[root]
    }
  },

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
