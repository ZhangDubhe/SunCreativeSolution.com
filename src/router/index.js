import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
import Construction from '@/containers/Construction'

// Views
import Dashboard from '@/views/Dashboard'
import Home from '@/views/Home'
import Post from '@/views/Post'
import Periodic from '@/views/Periodic'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Admin',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'post',
          name: 'Post',
          component: Post
        },
        {
          path: 'home',
          name: 'Home',
          component: Home
        },
        {
          path: 'periodic',
          name: 'Periodic',
          component: Periodic
        }

      ]
    },
    {
      path: '/dev',
      name: 'Dev',
      component: Construction,
      children: []
    }
  ]
})