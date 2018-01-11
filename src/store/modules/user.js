import Vue from 'vue'
import VueResource from 'vue-resource'
import md5 from 'md5'
import router from '../../router'
import * as types from '../mutation-types'

Vue.use(VueResource)

// initial state
const state = {
  user: null,
  profile: null,
  error: ''
}

// getters
const getters = {
  currentUser: state => state.user,
  profile: state => state.profile,
  loginError: state => state.error
}

// actions
const actions = {
  login ({ commit }, user) {
    let credentials = Object.assign({}, user)
    credentials.password = md5(credentials.password)
    Vue.http.post('/api/authorize', credentials)
      .then(response => {
        credentials.token = response.data.token
        credentials.id = response.data.id
        credentials.role = response.data.role
        commit(types.LOGIN, { credentials })
        router.push({ name: 'home' })
      })
      .catch(error => {
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
  logout ({ commit }) {
    commit(types.LOGOUT)
    router.push({ name: 'login' })
  }
}

// mutations
const mutations = {
  [types.LOGIN] (state, { credentials }) {
    state.user = credentials
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
    state.user = null
    state.profile = null
    router.push({ name: 'home' })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
