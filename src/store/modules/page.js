// @flow
import Vue from 'vue'
import VueResource from 'vue-resource'
import api from '../../../api/page'
import * as types from '../mutation-types'

Vue.use(VueResource)

// initial state
const state = {
  pages: {},
  selected: null
}

// getters
const getters = {
  page: () => state.selected ? state.pages[state.selected] : null
}

// actions
const actions = {
  delPageContent ({ commit }, { tag, root, id }) {
    commit(types.DEL_PAGE_CONTENT, { tag, root, id })
  },
  delSubPage ({ commit }, { tag, root, id }) {
    commit(types.DEL_SUB_PAGE, { tag, root, id })
  },
  plusPage ({ commit }, { tag, root, id }) {
    commit(types.PLUS_PAGE, { tag, root, id })
  },
  subPage ({ commit }, { tag, sub, parent }) {
    commit(types.SUB_PAGE, { tag, sub, parent })
  },
  setPage ({ commit }, { tag, page }) {
    commit(types.SET_PAGE, { tag, page })
  },
  delPage ({ commit }, { tag }) {
    commit(types.DEL_PAGE, { tag })
  },
  getPage ({ commit, state }, tag) {
    if (!state.pages[tag]) {
      api.getPage(tag, page => {
        commit(types.SET_PAGE, { tag, page })
        commit(types.SELECT_PAGE, { tag })
      })
    } else {
      commit(types.SELECT_PAGE, { tag })
    }
  }
}

// mutations
const mutations = {
  [types.DEL_PAGE_CONTENT] (state, { tag, root, id }) {
    let index = state.pages[tag][root].findIndex((page) => page.id === id)
    state.pages[tag][id].forEach((sub) => {
      delete state.pages[tag][sub.id]
    })
    delete state.pages[tag][id]
    state.pages[tag][root].splice(index, 1)
  },

  [types.DEL_PAGE] (state, { tag }) {
    delete state.pages[tag]
    state.pages[tag] = { root: [] }
    if (state.selected === tag) {
      state.selected = null
    }
  },

  [types.DEL_SUB_PAGE] (state, { tag, root, id }) {
    state.pages[tag][root].find((page) => page.id === id).data.pop()
  },

  [types.PLUS_PAGE] (state, { tag, root, id }) {
    state.pages[tag][root].find((page) => page.id === id).data.push({ops: [{ insert: '' }]})
  },

  [types.SUB_PAGE] (state, { tag, sub, parent }) {
    if (!state.pages[tag][parent]) {
      state.pages[tag][parent] = []
    }
    if (!state.pages[tag][sub]) {
      state.pages[tag][sub] = []
    }
    state.pages[tag][parent].push({
      parent,
      id: sub,
      data: [{}]
    })
  },

  [types.SET_PAGE] (state, { tag, page }) {
    state.pages[tag] = page
  },

  [types.SELECT_PAGE] (state, { tag }) {
    state.selected = tag
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
