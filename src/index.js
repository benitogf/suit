// @flow
import Wss from './lib/rws'
import './lib/rsw'
import Vue from 'vue'
import App from './app'
import router from './router'
import store from './store'
import filter from './filter'
import { sync } from 'vuex-router-sync'
import quill from '@/lib/quill'
import PictureInput from '@/lib/picture'
import VueMaterial from '@/config'

Vue.use(VueMaterial)
Vue.material.registerTheme({
  default: {
    primary: 'white',
    accent: 'black'
  },
  blue: {
    primary: 'blue',
    accent: 'pink'
  },
  indigo: {
    primary: 'indigo',
    accent: 'pink'
  },
  brown: {
    primary: 'brown',
    accent: 'green'
  },
  purple: {
    primary: 'purple',
    accent: 'blue'
  },
  orange: {
    primary: 'orange',
    accent: 'purple'
  },
  green: {
    primary: 'green',
    accent: 'pink'
  },
  'light-blue': {
    primary: 'light-blue',
    accent: 'yellow'
  },
  teal: {
    primary: 'teal',
    accent: 'orange'
  },
  'blue-grey': {
    primary: 'blue-grey',
    accent: 'blue'
  },
  cyan: {
    primary: 'cyan',
    accent: 'pink'
  },
  red: {
    primary: 'red',
    accent: 'pink'
  },
  white: {
    primary: 'white',
    accent: 'blue'
  },
  grey: {
    primary: {
      color: 'grey',
      hue: 300
    },
    accent: 'indigo'
  }
})
Vue.material.setCurrentTheme('teal')
sync(store, router)
Vue.use(quill)
Vue.use(PictureInput)

Vue.http.interceptors.push((request, next) => {
  if (store.getters.currentUser !== null) {
    request.headers.set('Authorization', 'Bearer ' + store.getters.currentUser.token)
  }
  request.headers.set('Accept', 'application/json')
  next(function (response) {
    if (response.status === 401) {
      store.dispatch('refreshToken', request).then(function (newResponse) {
        response = newResponse
      })
    }
  })
})

var ws = new Wss(process.env.WSS)
ws.onopen = function (evt) {
  console.info('OPEN')
}
ws.onclose = function (evt) {
  console.info('CLOSE')
}
ws.onmessage = function (evt) {
  console.info('RESPONSE: ' + evt.data)
}
ws.onerror = function (evt) {
  console.warn('ERROR:' + evt.data)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  filter,
  template: '<app/>',
  components: { App }
})
