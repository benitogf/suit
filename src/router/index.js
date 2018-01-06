import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import login from '@/components/login'
import home from '@/components/home'
import tag from '@/components/tag'
import admin from '@/components/admin'
import about from '@/components/about'
import shop from '@/components/shop'
import product from '@/components/product-view'
import nah from '@/components/404'

Vue.use(Router)

const authCheck = (to, from, next) => {
  if (store.getters.currentUser === null) {
    next('/login')
  } else {
    next()
  }
}

const logout = (to, from, next) => {
  store.dispatch('logout')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/shop',
      name: 'shop',
      component: shop,
      props: true
    },
    {
      path: '/product/:id',
      name: 'product',
      component: product
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      beforeEnter: (to, from, next) => {
        if (store.getters.currentUser !== null) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/tag/:id',
      name: 'tag',
      component: tag,
      props: true
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      props: true,
      beforeEnter: authCheck
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: logout
    },
    {
      path: '*',
      component: nah
    }
  ]
})
