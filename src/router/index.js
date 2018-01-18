import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import logout from '@/components/logout'
import home from '@/components/home'
import tag from '@/components/tag'
import about from '@/components/about'
import shop from '@/components/shop'
import product from '@/components/product-view'
import nah from '@/components/404'

Vue.use(Router)

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
      component: login
    },
    {
      path: '/tag/:id',
      name: 'tag',
      component: tag,
      props: true
    },
    {
      path: '/logout',
      name: 'logout',
      component: logout
    },
    {
      path: '*',
      component: nah
    }
  ]
})
