import Vue from 'vue'
import VueResource from 'vue-resource'
import md5 from 'md5'
import * as types from '../mutation-types'

Vue.use(VueResource)

// initial state
const state = {
  user: {
    account: null,
    id: null,
    role: null,
    token: null
  },
  profile: null,
  error: ''
}

// getters
const getters = {
  currentUser: state => state.user.account,
  profile: state => state.profile,
  loginError: state => state.error
}

// actions
const actions = {
  login ({ commit }, user) {
    user.password = md5(user.password)
    Vue.http.post('/api/authorize', user)
      .then(response => {
        user.token = response.data.token
        user.id = response.data.id
        user.role = response.data.role
        commit(types.LOGIN, { user })
      })
      .catch(error => {
        console.log(error)
        commit(types.LOGIN_ERROR, { error: error.data.message })
      })
  },
  refreshToken ({ commit, state }, request) {
    return Vue.http.put('/api/authorize', state.user, {}).then(function (response) {
      let token = response.data.token
      commit(types.REFRESH_TOKEN, { token })
      return Vue.http[request.method.toLowerCase()](request.url, { body: request.body || '' })
    })
  },
  async getProfile ({ commit }) {
    let response = await Vue.http.get('/api/restricted')
    let data = response.body
    commit(types.SET_PROFILE, { data })
  },
  logout ({ commit, state }) {
    return new Promise((resolve) => {
      commit(types.LOGOUT)
      resolve(state.user)
    })
  }
}

// mutations
const mutations = {
  [types.LOGIN] (state, { user }) {
    delete user.password
    state.user = user
    state.error = ''
  },
  [types.SET_PROFILE] (state, { data }) {
    state.profile = data
  },
  [types.LOGIN_ERROR] (state, { error }) {
    state.error = error
  },
  [types.REFRESH_TOKEN] (state, { token }) {
    state.user.token = token
  },
  [types.LOGOUT] (state) {
    state.user.account = null
    state.user.id = null
    state.user.role = null
    state.user.token = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
