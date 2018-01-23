import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import settings from '@/components/settings'
import page from '@/components/page-view'
import shop from '@/components/shop'
import product from '@/components/product-view'
import nah from '@/components/404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'shop',
      component: shop
    },
    {
      path: '/product/:id',
      name: 'product',
      component: product,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/page/:id',
      name: 'page',
      component: page,
      props: true
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings
    },
    {
      path: '*',
      component: nah
    }
  ]
})
